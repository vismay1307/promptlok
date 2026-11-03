import { eq, inArray } from "drizzle-orm";

import { db } from "../db/db.js";
import { promptCategories } from "../db/schema/categories.schema.js";
import { tags } from "../db/schema/tags.schema.js";
import { PromptRepository } from "../repositories/prompt.repository.js";
import { PromptTagRepository } from "../repositories/promptTag.repository.js";
import { PromptVersionRepository } from "../repositories/promptVersion.repository.js";
import { authorizationService } from "./authorization.service.js";
import { PromptMapper } from "../mappers/prompt.mapper.js";
import { ApiError } from "../utils/ApiError.js";

import type {
  CreatePromptInput,
  CreatePromptVersionInput,
  GetMineQuery,
  UpdatePromptInput,
  createPromptVersionSchema
} from "../validators/prompt.validators.js";
import { prompts } from "../db/schema/prompts.schema.js";

export class PromptService {
  constructor(
    private readonly promptRepository = new PromptRepository(),
    private readonly promptVersionRepository = new PromptVersionRepository(),
    private readonly promptTagRepository = new PromptTagRepository(),
  ) {}

  async create(userId: string, input: CreatePromptInput) {
    return db.transaction(async (tx) => {
      const promptRepository = new PromptRepository(tx);
      const promptVersionRepository = new PromptVersionRepository(tx);
      const promptTagRepository = new PromptTagRepository(tx);

      const category = await tx
        .select()
        .from(promptCategories)
        .where(eq(promptCategories.id, input.categoryId))
        .limit(1);

      if (!category[0]) {
        throw new ApiError(
          400,
          "BAD_REQUEST",
          "Invalid category",
        );
      }

      if (input.tagIds !== undefined && input.tagIds.length > 0) {
        const existingTags = await tx
          .select({ id: tags.id })
          .from(tags)
          .where(inArray(tags.id, input.tagIds));

        if (existingTags.length !== input.tagIds.length) {
          throw new ApiError(
            400,
            "BAD_REQUEST",
            "One or more tags are invalid",
          );
        }
      }

      const prompt = await promptRepository.create({
        authorId: userId,
        title: input.title,
        description: input.description,
        categoryId: input.categoryId,
        promptType: input.promptType,
        aiModelMetadata: input.aiModelMetadata,
        visibility: "private",
        lifecycleStatus: "draft",
      });

      if (!prompt) {
        throw new ApiError(
          500,
          "INTERNAL_SERVER_ERROR",
          "Failed to create prompt",
        );
      }

      const version = await promptVersionRepository.create({
        promptId: prompt.id,
        versionNumber: 1,
        content: input.content,
        editorId: userId,
      });

      if (!version) {
        throw new ApiError(
          500,
          "INTERNAL_SERVER_ERROR",
          "Failed to create prompt version",
        );
      }

      const updatedPrompt = await promptRepository.update(
        prompt.id,
        {
          currentVersionId: version.id,
        },
      );

      if (!updatedPrompt) {
        throw new ApiError(
          500,
          "INTERNAL_SERVER_ERROR",
          "Failed to set current prompt version",
        );
      }

      if (input.tagIds !== undefined) {
        for (const tagId of input.tagIds) {
          await promptTagRepository.attach(
            prompt.id,
            tagId,
          );
        }
      }

      return PromptMapper.toDTO(updatedPrompt);
    });
  }

  async getById(
    user: {
      id: string;
      accountStatus: string;
    } | null,
    promptId: string,
  ) {
    const prompt = await authorizationService.assertCanView(
      user,
      promptId,
    );

    let currentVersion = null;

    if (prompt.currentVersionId) {
      currentVersion =
        await this.promptVersionRepository.findById(
          prompt.currentVersionId,
        );
    }

    const canEdit = await this.canEdit(user, promptId);

    return {
      ...PromptMapper.toDTO(prompt),
      currentVersion,
      canEdit,
    };
  }

  async getMine(
    userId: string,
    options: GetMineQuery,
  ) {
    const prompts = await this.promptRepository.findMine(
      userId,
      options,
    );

    return prompts.map((prompt) =>
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
    await authorizationService.assertCanView(
      user,
      promptId,
    );

    await authorizationService.assertCanEdit(
      user,
      promptId,
    );

    return db.transaction(async (tx) => {
      const promptRepository = new PromptRepository(tx);
      const promptTagRepository = new PromptTagRepository(tx);

      if (input.categoryId) {
        const category = await tx
          .select()
          .from(promptCategories)
          .where(eq(promptCategories.id, input.categoryId))
          .limit(1);

        if (!category[0]) {
          throw new ApiError(
            400,
            "BAD_REQUEST",
            "Invalid category",
          );
        }
      }

      if (
        input.tagIds !== undefined &&
        input.tagIds.length > 0
      ) {
        const existingTags = await tx
          .select({ id: tags.id })
          .from(tags)
          .where(inArray(tags.id, input.tagIds));

        if (
          existingTags.length !== input.tagIds.length
        ) {
          throw new ApiError(
            400,
            "BAD_REQUEST",
            "One or more tags are invalid",
          );
        }
      }

      const metadata: {
        title?: string;
        description?: string | null;
        categoryId?: string;
        aiModelMetadata?: string | null;
        updatedAt: Date;
      } = {
        updatedAt: new Date(),
      };

      if (input.title !== undefined) {
        metadata.title = input.title;
      }

      if (input.description !== undefined) {
        metadata.description = input.description;
      }

      if (input.categoryId !== undefined) {
        metadata.categoryId = input.categoryId;
      }

      if (input.aiModelMetadata !== undefined) {
        metadata.aiModelMetadata =
          input.aiModelMetadata;
      }

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

      if (input.tagIds !== undefined) {
        await promptTagRepository.removeAllForPrompt(
          promptId,
        );

        for (const tagId of input.tagIds) {
          await promptTagRepository.attach(
            promptId,
            tagId,
          );
        }
      }

      return PromptMapper.toDTO(updatedPrompt);
    });
  }

  async softDelete(
    user: {
      id: string;
      accountStatus: string;
    } | null,
    promptId: string,
  ) {
    await authorizationService.assertCanView(
      user,
      promptId,
    );

    await authorizationService.assertCanEdit(
      user,
      promptId,
    );

    const deletedPrompt =
      await this.promptRepository.softDelete(
        promptId,
      );

    if (!deletedPrompt) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Prompt not found",
      );
    }

    return deletedPrompt;
  }
  async getVersions(
    user: {
      id: string;
      accountStatus: string;
    } | null,
    promptId: string,
  ) {
    await authorizationService.assertCanView(
      user,
      promptId,
    );

    return this.promptVersionRepository.findByPromptId(
      promptId,
    );
  }

  async getVersionById(
    user: {
      id: string;
      accountStatus: string;
    } | null,
    promptId: string,
    versionId: string,
  ) {
    await authorizationService.assertCanView(
      user,
      promptId,
    );

    const version =
      await this.promptVersionRepository.findByPromptAndVersion(
        promptId,
        versionId,
      );

    if (!version) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Prompt version not found",
      );
    }

    return version;
  }

  async createVersion(
    user: {
      id: string;
      accountStatus: string;
    } | null,
    promptId: string,
    input: CreatePromptVersionInput,
  ) {
    await authorizationService.assertCanEdit(
      user,
      promptId,
    );

    if (!user) {
      throw new ApiError(
        401,
        "UNAUTHORIZED",
        "Authentication required",
      );
    }

    return db.transaction(async (tx) => {
      // Lock the prompt row so concurrent version
      // creation requests for this prompt are serialized.
      const lockedPrompt = await tx
        .select()
        .from(prompts)
        .where(eq(prompts.id, promptId))
        .for("update")
        .limit(1);

      const prompt = lockedPrompt[0];

      if (!prompt || prompt.deletedAt) {
        throw new ApiError(
          404,
          "NOT_FOUND",
          "Prompt not found",
        );
      }

      const promptRepository = new PromptRepository(tx);

      const promptVersionRepository =
        new PromptVersionRepository(tx);
const latestVersion =
  await promptVersionRepository.findLatestByPromptId(
    promptId,
  );

// Prevent creating a duplicate version when content is unchanged.
if (latestVersion && latestVersion.content === input.content) {
  throw new ApiError(
    409,
    "NO_CHANGES",
    "Prompt content has not changed. No new version was created.",
  );
}

const nextVersionNumber =
  (latestVersion?.versionNumber ?? 0) + 1;

      const version = await promptVersionRepository.create({
        promptId,
        versionNumber: nextVersionNumber,
        content: input.content,
        changeNote: input.changeNote,
        editorId: user.id,
      });

      if (!version) {
        throw new ApiError(
          500,
          "INTERNAL_SERVER_ERROR",
          "Failed to create prompt version",
        );
      }

      const updatedPrompt = await promptRepository.update(
        promptId,
        {
          currentVersionId: version.id,
          updatedAt: new Date(),
        },
      );

      if (!updatedPrompt) {
        throw new ApiError(
          500,
          "INTERNAL_SERVER_ERROR",
          "Failed to update current prompt version",
        );
      }

      return version;
    });
  }

  async restoreVersion(
    user: {
      id: string;
      accountStatus: string;
    } | null,
    promptId: string,
    versionId: string,
  ) {
    await authorizationService.assertCanEdit(
      user,
      promptId,
    );

    if (!user) {
      throw new ApiError(
        401,
        "UNAUTHORIZED",
        "Authentication required",
      );
    }

    const sourceVersion =
      await this.promptVersionRepository.findByPromptAndVersion(
        promptId,
        versionId,
      );

    if (!sourceVersion) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Prompt version not found",
      );
    }

    return this.createVersion(
      user,
      promptId,
      {
        content: sourceVersion.content,
        changeNote: `Restored from version ${sourceVersion.versionNumber}`,
      },
    );
  }
  private async canEdit(
    user: {
      id: string;
      accountStatus: string;
    } | null,
    promptId: string,
  ) {
    if (!user) {
      return false;
    }

    try {
      await authorizationService.assertCanEdit(
        user,
        promptId,
      );

      return true;
    } catch {
      return false;
    }
  }
}

export const promptService = new PromptService();