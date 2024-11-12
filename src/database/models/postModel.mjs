import { Schema } from "mongoose";
import mongoose from "../config.mjs";

const postSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        slug: {
            type: String,
            unique: true
        },
        body: {
            type: String,
            required: true,
            maxLength: 1000000
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "categories",
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "users",
        }
    },
    {timestamps: true}
);

const Post = mongoose.model("post", postSchema);
export default Post;