
import { z } from "zod";
import type { PromptLifecycleStatus } from "@/lib/query-keys";
/**
 * Backend accepts only "text" for prompt creation currently.
 */
export const createPromptSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must contain at least 3 characters")
      .max(140, "Title cannot exceed 140 characters"),

    description: z
      .string()
      .max(2000, "Description cannot exceed 2000 characters")
      .optional(),

    content: z
      .string()
      .min(1, "Prompt content is required")
      .max(20000, "Content cannot exceed 20000 characters"),

    categoryId: z
      .string()
      .uuid("Please select a valid category"),

    tagIds: z
      .array(z.string().uuid())
      .max(10, "You can select a maximum of 10 tags")
      .refine(
        (tagIds) => new Set(tagIds).size === tagIds.length,
        "Duplicate tags are not allowed",
      )
      .optional(),

    promptType: z.literal("text"),

    aiModelMetadata: z
      .string()
      .max(100, "AI model metadata cannot exceed 100 characters")
      .optional(),
  })
  .strict();

/**
 * Form values inferred directly from the Zod schema.
 */
export type CreatePromptInput = z.infer<
  typeof createPromptSchema
>;

/**
 * Successful prompt creation response data.
 */
/**
 * Prompt visibility options supported by the backend.
 */
export type PromptVisibility =
  | "private"
  | "shared"
  | "team"
  | "organization"
  | "public";

/**
 * Prompt response returned by the backend.
 */
export type Prompt = {
  id: string;
  authorId: string;
  title: string;
  description: string | null;
  categoryId: string | null;
  promptType: "text" | "image";
  aiModelMetadata: string | null;
  visibility: PromptVisibility;
  lifecycleStatus: PromptLifecycleStatus;
  currentVersionId: string | null;
  createdAt: string;
  updatedAt: string;
};
