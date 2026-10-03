import type { Request, Response } from "express";
import { TagRepository } from "../repositories/tag.repository.js";
import { TagService } from "../services/tag.service.js";

const tagService = new TagService(
  new TagRepository()
);

export const searchTags = async (
  req: Request,
  res: Response
) => {
  const query =
    typeof req.query.q === "string"
      ? req.query.q
      : undefined;

  const tags = await tagService.searchTags(query);

  return res.status(200).json({
    success: true,
    message: "Tags fetched successfully",
    data: tags,
  });
};

export const createTag = async (
  req: Request,
  res: Response
) => {
  const tag = await tagService.findOrCreateTag(
    req.body.name
  );

  return res.status(200).json({
    success: true,
    message: "Tag created or already exists",
    data: tag,
  });
};