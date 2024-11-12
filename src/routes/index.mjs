import { Router } from "express";
import authRouter from "./authRouter.mjs";
import postRouter from "./postRouter.mjs";
import categoryRouter from "./categoryRouter.mjs";

const router = Router();
router.use(authRouter);
router.use(postRouter);
router.use(categoryRouter);

export default router;