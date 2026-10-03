import type { Request, Response } from "express";
import { CategoryRepository } from "../repositories/category.repository.js";
import { CategoryService } from "../services/category.service.js";

const categoryService = new CategoryService(
  new CategoryRepository()
);

export const getCategories = async (
  _req: Request,
  res: Response
) => {
  const categories = await categoryService.getAllCategories();

  return res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
};