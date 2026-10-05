import { db } from "../db/db.js";
import { promptCategories } from "../db/schema/categories.schema.js";
import { tags } from "../db/schema/tags.schema.js";

import { PromptRepository } from "../repositories/prompt.repository.js";
import { PromptVersionRepository } from "../repositories/promptVersion.repository.js";
import { PromptTagRepository } from "../repositories/promptTag.repository.js";

import { PromptMapper } from "../mappers/prompt.mapper.js";
import { ApiError } from "../utils/ApiError.js";

import type {
  CreatePromptInput,
  GetMineQuery,
  UpdatePromptInput,
} from "../validators/prompt.validators.js";

import { eq, inArray } from "drizzle-orm";

import {
  authorizationService,
} from "./authorization.service.js";

export class PromptService {
  async create(
    authorId: string,
    input: CreatePromptInput,
  ) {
    return db.transaction(
      async (tx) => {
        const promptRepository =
          new PromptRepository(tx);

        const promptVersionRepository =
          new PromptVersionRepository(tx);

        const promptTagRepository =
          new PromptTagRepository(tx);

        // 1. Category validation
        const category =
          await tx
            .select()
            .from(promptCategories)
            .where(
              eq(
                promptCategories.id,
                input.categoryId,
              ),
            )
            .limit(1);

        if (!category[0]) {
          throw new ApiError(
            400,
            "BAD_REQUEST",
            "Invalid category",
          );
        }

        // 2. Tag validation
        const tagIds =
          input.tagIds ?? [];

        if (tagIds.length > 0) {
          const existingTags =
            await tx
              .select({
                id: tags.id,
              })
              .from(tags)
              .where(
                inArray(
                  tags.id,
                  tagIds,
                ),
              );

          if (
            existingTags.length !==
            tagIds.length
          ) {
            throw new ApiError(
              400,
              "BAD_REQUEST",
              "One or more tags are invalid",
            );
          }
        }

        // 3. Create prompt
        const prompt =
          await promptRepository.create({
            authorId,
            title: input.title,
            description:
              input.description ??
              null,
            categoryId:
              input.categoryId,
            promptType: "text",
            aiModelMetadata:
              input.aiModelMetadata ??
              null,
            visibility: "private",
            lifecycleStatus: "draft",
            currentVersionId: null,
          });

        if (!prompt) {
          throw new ApiError(
            500,
            "INTERNAL_SERVER_ERROR",
            "Failed to create prompt",
          );
        }

        // 4. Create version 1
        const version =
          await promptVersionRepository.create({
            promptId: prompt.id,
            versionNumber: 1,
            content: input.content,
            editorId: authorId,
            changeNote: null,
          });

        if (!version) {
          throw new ApiError(
            500,
            "INTERNAL_SERVER_ERROR",
            "Failed to create prompt version",
          );
        }

        // 5. Set currentVersionId
        const updatedPrompt =
          await promptRepository.update(
            prompt.id,
            {
              currentVersionId:
                version.id,
            },
          );

        if (!updatedPrompt) {
          throw new ApiError(
            500,
            "INTERNAL_SERVER_ERROR",
            "Failed to update current prompt version",
          );
        }

        // 6. Attach tags
        for (
          const tagId of tagIds
        ) {
          await promptTagRepository.attach(
            prompt.id,
            tagId,
          );
        }

        // 7. Return DTO
        return PromptMapper.toDTO(
          updatedPrompt,
        );
      },
    );
  }

  async getById(
    user: {
      id: string;
      accountStatus: string;
    } | null,
    promptId: string,
  ) {
    const prompt =
      await authorizationService.assertCanView(
        user,
        promptId,
      );

    if (
      !prompt.currentVersionId
    ) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Prompt not found",
      );
    }

    const promptVersionRepository =
      new PromptVersionRepository();

    const currentVersion =
      await promptVersionRepository.findById(
        prompt.currentVersionId,
      );

    if (!currentVersion) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Prompt not found",
      );
    }

    return {
      ...PromptMapper.toDTO(
        prompt,
      ),

      currentVersion: {
        id: currentVersion.id,
        promptId:
          currentVersion.promptId,
        versionNumber:
          currentVersion.versionNumber,
        content:
          currentVersion.content,
        editorId:
          currentVersion.editorId,
        changeNote:
          currentVersion.changeNote,
        createdAt:
          currentVersion.createdAt,
      },

      canEdit:
        user !== null &&
        user.accountStatus ===
          "active" &&
        prompt.authorId ===
          user.id,
    };
  }

  async getMine(
    authorId: string,
    options: GetMineQuery,
  ) {
    const promptRepository =
      new PromptRepository();

    const prompts =
      await promptRepository.findMine(
        authorId,
        options,
      );

    return prompts.map(
      (prompt) =>
        PromptMapper.toDTO(prompt),
    );
  }

  async update(
    user: {
      id: string;
      accountStatus: string;
    } | null,
    promptId: string,
    input: UpdatePromptInput,
  ) {
    // 1. View authorization first
    await authorizationService.assertCanView(
      user,
      promptId,
    );

    // 2. Edit authorization second
    await authorizationService.assertCanEdit(
      user,
      promptId,
    );

    return db.transaction(
      async (tx) => {
        const promptRepository =
          new PromptRepository(tx);

        const promptTagRepository =
          new PromptTagRepository(tx);

        // 3. Validate category if supplied
        if (input.categoryId) {
          const category =
            await tx
              .select()
              .from(
                promptCategories,
              )
              .where(
                eq(
                  promptCategories.id,
                  input.categoryId,
                ),
              )
              .limit(1);

          if (!category[0]) {
            throw new ApiError(
              400,
              "BAD_REQUEST",
              "Invalid category",
            );
          }
        }

        // 4. Validate tags if supplied
        if (
          input.tagIds !== undefined &&
          input.tagIds.length > 0
        ) {
          const existingTags =
            await tx
              .select({
                id: tags.id,
              })
              .from(tags)
              .where(
                inArray(
                  tags.id,
                  input.tagIds,
                ),
              );

          if (
            existingTags.length !==
            input.tagIds.length
          ) {
            throw new ApiError(
              400,
              "BAD_REQUEST",
              "One or more tags are invalid",
            );
          }
        }

        // 5. Build metadata update
        const metadata: {
          title?: string;
          description?: string | null;
          categoryId?: string;
          aiModelMetadata?:
            | string
            | null;
          updatedAt: Date;
        } = {
          updatedAt: new Date(),
        };

        if (
          input.title !== undefined
        ) {
          metadata.title =
            input.title;
        }

        if (
          input.description !==
          undefined
        ) {
          metadata.description =
            input.description;
        }

        if (
          input.categoryId !==
          undefined
        ) {
          metadata.categoryId =
            input.categoryId;
        }

        if (
          input.aiModelMetadata !==
          undefined
        ) {
          metadata.aiModelMetadata =
            input.aiModelMetadata;
        }

        // 6. Update prompt metadata
        const updatedPrompt =
          await promptRepository.updateMetadata(
            promptId,
            metadata,
          );

        if (!updatedPrompt) {
          throw new ApiError(
            404,
            "NOT_FOUND",
            "Prompt not found",
          );
        }

        // 7. Replace complete tag set
        if (
          input.tagIds !== undefined
        ) {
          await promptTagRepository.removeAllForPrompt(
            promptId,
          );

          for (
            const tagId of input.tagIds
          ) {
            await promptTagRepository.attach(
              promptId,
              tagId,
            );
          }
        }

        // 8. Return updated DTO
        return PromptMapper.toDTO(
          updatedPrompt,
        );
      },
    );
  }
}

export const promptService =
  new PromptService();