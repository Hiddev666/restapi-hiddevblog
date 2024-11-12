import { Schema } from "mongoose";
import mongoose from "../config.mjs";

const categorySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        }
    },
    {timestamps: true}
);

const Category = mongoose.model("category", categorySchema);
export default Category;