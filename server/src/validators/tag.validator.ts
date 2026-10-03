import { z } from "zod";

export const searchTagsSchema = {
  query: z.object({
    q: z
      .string()
      .trim()
      .min(1, "Search query cannot be empty")
      .max(50, "Search query is too long")
      .optional(),
  }),
};

export const createTagSchema = {
  body: z.object({
    name: z
      .string()
      .trim()
      .min(1, "Tag name is required")
      .max(50, "Tag name is too long"),
  }),
};