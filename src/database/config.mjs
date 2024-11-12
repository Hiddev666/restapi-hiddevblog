import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.MONGODB_STRING)
    .then(console.log("MongoDB was connected"))
    .catch((e) => console.log(`err db : ${e.message}`));

export default mongoose;