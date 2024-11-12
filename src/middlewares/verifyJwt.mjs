import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import BlacklistedJwt from "../database/models/blacklistedJwtModel.mjs";

dotenv.config();
export const verifyJwt = async (req, res, next) => {
    const token = req.header("Authorization")

    try {
        if (token) {
            const jwtToken = token.split(" ")[1]

            const blacklistedJwt = await BlacklistedJwt.findOne({ token: jwtToken });
            if (blacklistedJwt) return res.status(403).send({ message: "Invalid Token" });

            jwt.verify(jwtToken, process.env.JWT_KEY, (err, result) => {
                if (err) return res.status(403).send({ message: "Invalid Token" });
                req.result = result;
                res.cookie("jwt", jwtToken)
                next();
            });
        } else {
            res.status(401).send({ message: "Your not authenticated" });
        }
    } catch (err) {
        res.send({ message: err.message })
    }
}