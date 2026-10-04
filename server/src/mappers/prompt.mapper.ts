import type { prompts } from "../db/schema/prompts.schema.js";

type PromptRow = typeof prompts.$inferSelect;

export class PromptMapper {
  static toDTO(prompt: PromptRow) {
    return {
      id: prompt.id,
      authorId: prompt.authorId,
      title: prompt.title,
      description: prompt.description,
      categoryId: prompt.categoryId,
      promptType: prompt.promptType,
      aiModelMetadata: prompt.aiModelMetadata,
      visibility: prompt.visibility,
      lifecycleStatus: prompt.lifecycleStatus,
      currentVersionId: prompt.currentVersionId,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    };
  }
}