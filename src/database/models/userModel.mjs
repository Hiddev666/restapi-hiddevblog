import mongoose from "../config.mjs";

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            lowercase: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }
);

const User = mongoose.model("user", userSchema);
export default User;