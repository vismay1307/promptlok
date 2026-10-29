
import type { Request, Response, NextFunction } from "express";
import { TagRepository } from "../repositories/tag.repository.js";
import { TagService } from "../services/tag.service.js";

const tagService = new TagService(new TagRepository());

export const searchTags = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = res.locals.validated.query.q as string | undefined;
    const tags = await tagService.searchTags(query);

    return res.status(200).json({
      success: true,
      message: "Tags fetched successfully",
      data: tags,
    });
  } catch (error) {
    return next(error);
  }
};

export const createTag = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = res.locals.validated.body as { name: string };
    const tag = await tagService.findOrCreateTag(name);

    return res.status(200).json({
      success: true,
      message: "Tag created or already exists",
      data: tag,
    });
  } catch (error) {
    return next(error);
  }
};
