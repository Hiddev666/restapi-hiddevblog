import { Router } from "express";
import User from "../database/models/userModel.mjs";
import BlacklistedJwt from "../database/models/blacklistedJwtModel.mjs";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import { verifyJwt } from "../middlewares/verifyJwt.mjs";

dotenv.config();
const router = Router();
router.use(cors())

// Register
router.post("/api/auth/register", async (req, res) => {
    const { body } = req;

    const encryptedPassword = CryptoJS.AES.encrypt(
        body.password,
        process.env.CRYPTO_KEY
    );
    body.password = encryptedPassword;
    
    try {
        const newUser = await new User(body).save();
        res.send({
            message: "New User was created",
            data: newUser
        })
    } catch (err) {
        res.send({
            message: err.message
        });
    }
});

router.post("/api/auth/login", async (req, res) => {
    const { body } = req;
    
    try {
        const user = await User.findOne({username: body.username});
        if(!user) return res.status(401).send({message: `Username ${body.username} not found`});
        
        const decryptedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.CRYPTO_KEY
        ).toString(CryptoJS.enc.Utf8);
        if(body.password != decryptedPassword) return res.status(401).send({message: "Invalid Password"})
        
        const jwtToken = jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_KEY,
            {expiresIn: "3d"}
        );

        console.log(req.cookies)

        const {password, __v, ...credentials} = user._doc;

        res.cookie("token", jwtToken).send({
            message: "Login Successfully",
            data: {...credentials, jwtToken}
        })
    } catch (err) {
        res.send({
            message: err.message
        });
    }
});

router.post("/api/auth/logout", verifyJwt, async (req, res) => {
    const token = req.header("Authorization").split(" ")[1];
    
    try {
        const blacklistedJwt = await new BlacklistedJwt({token: token}).save();
        res.send({
            message: "Logout Successfully"
        })
    } catch (err) {
        res.send({
            message: err.message
        });
    }
});

export default router;