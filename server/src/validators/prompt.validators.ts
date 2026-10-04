import { z } from "zod";

export const createPromptSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(140, "Title must not exceed 140 characters"),

    description: z
      .string()
      .max(2000, "Description must not exceed 2000 characters")
      .optional(),

    content: z
      .string()
      .min(1, "Content is required")
      .max(20000, "Content must not exceed 20000 characters"),

    categoryId: z
      .string()
      .uuid("Category ID must be a valid UUID"),

    tagIds: z
      .array(z.string().uuid("Tag ID must be a valid UUID"))
      .max(10, "A prompt can have at most 10 tags")
      .refine(
        (tagIds) => new Set(tagIds).size === tagIds.length,
        "Duplicate tag IDs are not allowed",
      )
      .optional(),

    promptType: z
      .literal("text"),

    aiModelMetadata: z
      .string()
      .max(100, "AI model metadata must not exceed 100 characters")
      .optional(),
  })
  .strict();

export type CreatePromptInput = z.infer<typeof createPromptSchema>;