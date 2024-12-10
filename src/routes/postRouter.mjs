import { Router } from "express";
import dotenv, { parse } from "dotenv";
import jwt from "jsonwebtoken";
import { verifyJwt } from "../middlewares/verifyJwt.mjs";
import Post from "../database/models/postModel.mjs";
import slugify from "slugify";
import cors from "cors"
import mongoose, { Schema } from "mongoose";

dotenv.config();
const router = Router();
router.use(cors())

// Register
router.post("/api/posts/", verifyJwt, async (req, res) => {
    const { body } = req;
    const slug = slugify(body.title).toLowerCase();
    body.slug = slug;

    try {
        const newPost = await new Post(body).save();
        res.send({
            message: "New Post was created",
            data: newPost
        })
    } catch (err) {
        res.send({
            message: err.message
        });
    }
});

router.get("/api/posts/", async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    try {
        const startIndex = (page - 1) * limit
        const total = await Post.countDocuments()

        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $unwind: "$author"
            },
            {
                $project: {
                    category: {
                        createdAt: 0,
                        updatedAt: 0,
                        __v: 0
                    },
                    author: {
                        createdAt: 0,
                        updatedAt: 0,
                        email: 0,
                        password: 0,
                        __v: 0
                    },
                    __v: 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]).skip(startIndex).limit(limit)
        res.send({
            message: "Get Posts Successfully",
            pagination: {
                page: page,
                limit: limit,
                totalItems: total,
                pages: Math.ceil(total / limit)
            },
            data: posts
        })
    } catch (err) {
        res.send({
            message: err.message
        })
    }
});

router.get("/api/posts/:slug", async (req, res) => {
    const { params: { slug } } = req;

    try {
        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $project: {
                    category: {
                        createdAt: 0,
                        updatedAt: 0,
                        __v: 0
                    },
                    author: {
                        createdAt: 0,
                        updatedAt: 0,
                        email: 0,
                        password: 0,
                        __v: 0
                    },
                    __v: 0
                }
            },
            {
                $unwind: "$author"
            },
            {
                $match: {
                    slug: slug
                }
            }
        ])
        res.send({
            message: "Get A Post Successfully",
            data: posts
        })
    } catch (err) {
        res.send({
            message: err.message
        })
    }
});

router.get("/api/posts/user/:username", async (req, res) => {
    const { params: { username } } = req;
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    try {
        const startIndex = (page - 1) * limit
        const postsTotal = await Post.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $project: {
                    author: {
                        _id: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        email: 0,
                        password: 0,
                        __v: 0
                    },
                    __v: 0
                }
            },
            {
                $unwind: "$author"
            },
            {
                $match: {
                    author: {
                        username: username
                    }
                }
            }
        ])
        const total = postsTotal.length

        const posts = await Post.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $project: {
                    category: {
                        createdAt: 0,
                        updatedAt: 0,
                        __v: 0
                    },
                    author: {
                        _id: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        email: 0,
                        password: 0,
                        __v: 0
                    },
                    __v: 0
                }
            },
            {
                $unwind: "$author"
            },
            {
                $match: {
                    author: {
                        username: username
                    }
                }
            },
            {
                $sort: {
                    updatedAt: -1
                }
            }
        ]).skip(startIndex).limit(limit)


        res.send({
            message: "Get Posts Successfully",
            pagination: {
                page: page,
                limit: limit,
                totalItems: total,
                pages: Math.ceil(total / limit)
            },
            data: posts
        })
    } catch (err) {
        res.send({
            message: err.message
        })
    }
});

router.patch("/api/posts/:slug", verifyJwt, async (req, res) => {
    const { body, params: { slug } } = req

    try {
        const post = await Post.findOneAndUpdate({ slug: slug }, body)
        res.send({
            message: "A Post Updated",
            data: post
        })
    } catch (err) {
        res.send({
            message: err.message
        });
    }
});

router.delete("/api/posts/:slug", verifyJwt, async (req, res) => {
    const { params: { slug } } = req;

    try {
        const post = await Post.findOneAndDelete({ slug: slug });
        res.send({
            message: `Delete A post successfully`
        })
    } catch (err) {
        res.send({
            message: err.message
        })
    }
});
export default router;