import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.mjs";
import { verifyJwt } from "./middlewares/verifyJwt.mjs";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT;

app.use(express.json())
app.use(router);
app.use(cors());
app.use(cookieParser())

// ROOT ROUTE
app.get("/", (req, res) => {
    res.send({
        message: "Welcome To HIDDEVBLOG REST API!"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});