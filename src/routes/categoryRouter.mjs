import { Router } from "express";
import dotenv from "dotenv";
import { verifyJwt } from "../middlewares/verifyJwt.mjs";
import cors from "cors";
import Category from "../database/models/categoryModel.mjs";

dotenv.config();
const router = Router();
router.use(cors())

// Register
router.post("/api/categories/", verifyJwt, async (req, res) => {
    const { body } = req;

    try {
        const newCategory = await new Category(body).save();
        res.send({
            message: "New Category was created",
            data: newCategory
        })
    } catch (err) {
        res.send({
            message: err.message
        });
    }
});

router.get("/api/categories/", async (req, res) => {
    try {
        const category = await Category.find().select({ __v: 0 });
        res.send({
            message: "Get categories successfully",
            data: category
        })
    } catch (err) {
        res.send({
            message: err.message
        });
    }
});

router.get("/api/categories/:id", async (req, res) => {
    const { params: { id } } = req;

    try {
        const category = await Category.findOne({ _id: id });
        res.send({
            message: `Get Category ${id} Successfully`,
            data: category
        })
    } catch (err) {
        res.send({
            message: err.message
        });
    }
});

router.patch("/api/categories/:id", verifyJwt, async (req, res) => {
    const { body, params: { id } } = req;

    try {
        const category = await Category.findByIdAndUpdate(id, body);
        res.send({
            message: `Update category ${id} successfully`,
            data: category
        })
    } catch (err) {
        res.send({
            message: err.message
        });
    }
});

router.delete("/api/categories/:id", verifyJwt, async (req, res) => {
    const { params: { id } } = req;

    try {
        const category = await Category.findByIdAndDelete(id);
        res.send({
            message: `Delete category ${id} successfully`
        })
    } catch (err) {
        res.send({
            message: err.message
        })
    }
});

export default router;