import { z } from "zod";

export const createPromptVersionSchema = z
  .object({
    content: z
      .string()
      .min(1, "Prompt content is required.")
      .max(20000, "Prompt content cannot exceed 20,000 characters.")
      .refine(
        (value) => value.trim().length > 0,
        "Prompt content cannot be empty.",
      ),

    changeNote: z
      .string()
      .max(500, "Change note cannot exceed 500 characters.")
      .optional(),
  })
  .strict();

export type PromptVersion = {
  id: string;
  promptId: string;
  versionNumber: number;
  content: string;
  changeNote: string | null;
  editorId: string;
  createdAt: string;
};

export type PromptVersionHistoryItem = {
  id: string;
  promptId: string;
  versionNumber: number;
  changeNote: string | null;
  editorId: string;
  createdAt: string;
};

export type CreatePromptVersionInput = z.infer<
  typeof createPromptVersionSchema
>;