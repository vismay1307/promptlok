import { Router, type Router as ExpressRouter } from "express";
import { getCategories } from "../controllers/category.controller.js";

const router: ExpressRouter = Router();

router.get("/", getCategories);

export default router;