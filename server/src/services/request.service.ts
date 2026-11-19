
import { eq, inArray } from "drizzle-orm";

import { db } from "../db/db.js";
import { promptCategories } from "../db/schema/categories.schema.js";
import { tags } from "../db/schema/tags.schema.js";
import { authorizationService } from "./authorization.service.js";
import { PromptRequestRepository } from "../repositories/promptRequest.repository.js";
import { RequestTagRepository } from "../repositories/requestTag.repository.js";

import { RequestMapper } from "../mappers/request.mapper.js";
import { ApiError } from "../utils/ApiError.js";

import type {
  CreateRequestInput,
  UpdateRequestInput,
  RequestListQuery,
} from "../validators/request.validators.js";

type RequestViewer = {
  id: string;
  accountStatus: string;
};

export class RequestService {
  async create(user: RequestViewer, input: CreateRequestInput) {
    return db.transaction(async (tx) => {
      const requestRepository = new PromptRequestRepository(tx);
      const requestTagRepository = new RequestTagRepository(tx);

      const category = await tx
        .select({ id: promptCategories.id })
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

      if (input.tagIds?.length) {
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

      const request = await requestRepository.create({
        requesterId: user.id,
        title: input.title,
        description: input.description,
        context: input.context,
        categoryId: input.categoryId,
      });

      if (!request) {
        throw new ApiError(
          500,
          "INTERNAL_SERVER_ERROR",
          "Failed to create request",
        );
      }

      await requestTagRepository.replaceTags(
        request.id,
        input.tagIds ?? [],
      );

      const createdRequest =
        await requestRepository.findByIdVisible(request.id);

      if (!createdRequest) {
        throw new ApiError(
          500,
          "INTERNAL_SERVER_ERROR",
          "Failed to retrieve created request",
        );
      }

      const requestTags =
        await requestTagRepository.findTagsByRequestId(request.id);

      return RequestMapper.toDTO(
        createdRequest,
        requestTags,
        user,
      );
    });
  }
  async update(
    user: RequestViewer,
    requestId: string,
    input: UpdateRequestInput,
  ) {
    await authorizationService.assertCanEditRequest(
      user,
      requestId,
      "edit",
    );

    return db.transaction(async (tx) => {
      const repository = new PromptRequestRepository(tx);
      const tagRepository = new RequestTagRepository(tx);

      const { tagIds, ...fields } = input;

      if (fields.categoryId) {
        const category = await tx
          .select({ id: promptCategories.id })
          .from(promptCategories)
          .where(eq(promptCategories.id, fields.categoryId))
          .limit(1);

        if (!category[0]) {
          throw new ApiError(400, "BAD_REQUEST", "Invalid category");
        }
      }

      if (tagIds !== undefined && tagIds.length > 0) {
        const existingTags = await tx
          .select({ id: tags.id })
          .from(tags)
          .where(inArray(tags.id, tagIds));

        if (existingTags.length !== tagIds.length) {
          throw new ApiError(
            400,
            "BAD_REQUEST",
            "One or more tags are invalid",
          );
        }
      }

      const updated = await repository.updateOpen(
        requestId,
        user.id,
        fields,
      );

      if (!updated) {
        throw new ApiError(
          409,
          "REQUEST_NOT_OPEN",
          "Request can no longer be edited",
        );
      }

      // Replace tags only when tagIds was supplied.
      if (tagIds !== undefined) {
        await tagRepository.replaceTags(requestId, tagIds);
      }

      const request = await repository.findByIdVisible(requestId);

      if (!request) {
        throw new ApiError(404, "NOT_FOUND", "Request not found");
      }

      const requestTags =
        await tagRepository.findTagsByRequestId(requestId);

      return RequestMapper.toDTO(request, requestTags, user);
    });
  }

  async close(user: RequestViewer, requestId: string) {
    await authorizationService.assertCanEditRequest(
      user,
      requestId,
      "close",
    );

    return db.transaction(async (tx) => {
      const repository = new PromptRequestRepository(tx);
      const tagRepository = new RequestTagRepository(tx);

      const closed = await repository.closeOpen(requestId, user.id);

      if (!closed) {
        throw new ApiError(
          409,
          "REQUEST_NOT_OPEN",
          "Request can no longer be closed",
        );
      }

      const request = await repository.findByIdVisible(requestId);

      if (!request) {
        throw new ApiError(404, "NOT_FOUND", "Request not found");
      }

      const requestTags =
        await tagRepository.findTagsByRequestId(requestId);

      return RequestMapper.toDTO(request, requestTags, user);
    });
  }

  async softDelete(user: RequestViewer, requestId: string) {
    await authorizationService.assertCanEditRequest(
      user,
      requestId,
      "delete",
    );

    const repository = new PromptRequestRepository();

    const deleted = await repository.softDeleteOpen(
      requestId,
      user.id,
    );

    if (!deleted) {
      throw new ApiError(
        409,
        "REQUEST_NOT_OPEN",
        "Request can no longer be deleted",
      );
    }

    return {
      id: requestId,
      deleted: true,
    };
  }
  async getById(user: RequestViewer, requestId: string) {
    const repository = new PromptRequestRepository();
    const tagRepository = new RequestTagRepository();

    const request = await repository.findByIdVisible(requestId);

    if (!request) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Request not found",
      );
    }

    const requestTags =
      await tagRepository.findTagsByRequestId(requestId);

    return RequestMapper.toDTO(request, requestTags, user);
  }

  async list(user: RequestViewer, options: RequestListQuery) {
    const repository = new PromptRequestRepository();
    const tagRepository = new RequestTagRepository();

    const result = await repository.list(options);

    const items = await Promise.all(
      result.items.map(async (row) => {
        const requestTags =
          await tagRepository.findTagsByRequestId(row.request.id);

        return RequestMapper.toDTO(row, requestTags, user);
      }),
    );

    return {
      items,
      meta: {
        total: result.total,
        limit: options.limit,
        offset: options.offset,
        hasMore: options.offset + items.length < result.total,
      },
    };
  }

  async getMine(user: RequestViewer, options: RequestListQuery) {
    const repository = new PromptRequestRepository();
    const tagRepository = new RequestTagRepository();

    const result = await repository.list({
      ...options,
      requesterId: user.id,
    });

    const items = await Promise.all(
      result.items.map(async (row) => {
        const requestTags =
          await tagRepository.findTagsByRequestId(row.request.id);

        return RequestMapper.toDTO(row, requestTags, user);
      }),
    );

    return {
      items,
      meta: {
        total: result.total,
        limit: options.limit,
        offset: options.offset,
        hasMore: options.offset + items.length < result.total,
      },
    };
  }
}

export const requestService = new RequestService();
