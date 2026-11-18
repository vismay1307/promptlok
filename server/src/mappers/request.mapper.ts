
import type { PromptRequestRepository } from "../repositories/promptRequest.repository.js";
import type { RequestTagRepository } from "../repositories/requestTag.repository.js";

type RequestRecord = NonNullable<
  Awaited<ReturnType<PromptRequestRepository["findByIdVisible"]>>
>;

type RequestTags = Awaited<
  ReturnType<RequestTagRepository["findTagsByRequestId"]>
>;

type RequestViewer = {
  id: string;
  accountStatus: string;
};

export class RequestMapper {
  static toDTO(
    row: RequestRecord,
    tags: RequestTags,
    viewer: RequestViewer | null,
  ) {
    const request = row.request;
    const isActive = viewer?.accountStatus === "active";
    const isRequester = viewer?.id === request.requesterId;
    const isOpen = request.status === "open";

    return {
      id: request.id,
      title: request.title,
      description: request.description,
      context: request.context,
      category: row.category?.id
        ? {
            id: row.category.id,
            name: row.category.name,
          }
        : null,
      tags: tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
      status: request.status,
      acceptedResponseId: request.acceptedResponseId,
      responseCount: row.responseCount,
      requester: {
        username: row.requester.username,
        displayName: row.requester.displayName,
        avatar: row.requester.avatar,
      },
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
      viewer: {
        canEdit: Boolean(isActive && isRequester && isOpen),
        canClose: Boolean(isActive && isRequester && isOpen),
        canAccept: Boolean(
          isActive &&
          isRequester &&
          isOpen &&
          row.responseCount > 0,
        ),
        canRespond: Boolean(
          isActive &&
          !isRequester &&
          isOpen,
        ),
      },
    };
  }
}
