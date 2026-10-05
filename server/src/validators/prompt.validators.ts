import { z } from "zod";

export const createPromptSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(
        140,
        "Title must not exceed 140 characters",
      ),

    description: z
      .string()
      .max(
        2000,
        "Description must not exceed 2000 characters",
      )
      .optional(),

    content: z
      .string()
      .min(1, "Content is required")
      .max(
        20000,
        "Content must not exceed 20000 characters",
      ),

    categoryId: z
      .string()
      .uuid("Category ID must be a valid UUID"),

    tagIds: z
      .array(
        z
          .string()
          .uuid("Tag ID must be a valid UUID"),
      )
      .max(
        10,
        "A prompt can have at most 10 tags",
      )
      .refine(
        (tagIds) =>
          new Set(tagIds).size === tagIds.length,
        "Duplicate tag IDs are not allowed",
      )
      .optional(),

    promptType: z.literal("text"),

    aiModelMetadata: z
      .string()
      .max(
        100,
        "AI model metadata must not exceed 100 characters",
      )
      .optional(),
  })
  .strict();

export type CreatePromptInput = z.infer<
  typeof createPromptSchema
>;

export const promptIdParamSchema = z.object({
  id: z
    .string()
    .uuid("Invalid prompt ID"),
});

export type PromptIdParam = z.infer<
  typeof promptIdParamSchema
>;

export const getMineQuerySchema = z
  .object({
    limit: z.coerce
      .number()
      .int("Limit must be an integer")
      .min(
        1,
        "Limit must be at least 1",
      )
      .max(
        50,
        "Limit must not exceed 50",
      )
      .default(20),

    offset: z.coerce
      .number()
      .int("Offset must be an integer")
      .min(
        0,
        "Offset cannot be negative",
      )
      .default(0),

    categoryId: z
      .string()
      .uuid(
        "Category ID must be a valid UUID",
      )
      .optional(),

    lifecycleStatus: z
      .enum([
        "draft",
        "active",
        "archived",
      ])
      .optional(),
  })
  .strict();

export type GetMineQuery = z.infer<
  typeof getMineQuerySchema
>;

/**
 * PATCH /api/prompts/:id
 *
 * Only metadata is mutable.
 * Prompt content must be changed through versions.
 */
export const updatePromptSchema = z
  .object({
    title: z
      .string()
      .min(
        3,
        "Title must be at least 3 characters",
      )
      .max(
        140,
        "Title must not exceed 140 characters",
      )
      .optional(),

    description: z
      .string()
      .max(
        2000,
        "Description must not exceed 2000 characters",
      )
      .nullable()
      .optional(),

    categoryId: z
      .string()
      .uuid(
        "Category ID must be a valid UUID",
      )
      .optional(),

    tagIds: z
      .array(
        z
          .string()
          .uuid("Tag ID must be a valid UUID"),
      )
      .max(
        10,
        "A prompt can have at most 10 tags",
      )
      .refine(
        (tagIds) =>
          new Set(tagIds).size === tagIds.length,
        "Duplicate tag IDs are not allowed",
      )
      .optional(),

    aiModelMetadata: z
      .string()
      .max(
        100,
        "AI model metadata must not exceed 100 characters",
      )
      .nullable()
      .optional(),

    /**
     * Explicitly reject content updates.
     */
    content: z
      .any()
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if ("content" in data) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["content"],
        message:
          "content edits go through versions",
      });
    }

    const mutableFields = [
      "title",
      "description",
      "categoryId",
      "tagIds",
      "aiModelMetadata",
    ] as const;

    const hasMutableField =
      mutableFields.some((field) =>
        Object.prototype.hasOwnProperty.call(
          data,
          field,
        ),
      );

    if (!hasMutableField) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one metadata field is required",
      });
    }
  });

export type UpdatePromptInput = z.infer<
  typeof updatePromptSchema
>;