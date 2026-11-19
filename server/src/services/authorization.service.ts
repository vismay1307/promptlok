
import { ApiError } from "../utils/ApiError.js";
import { PromptRepository } from "../repositories/prompt.repository.js";
import { RequestRepository } from "../repositories/request.repository.js";

export type AuthorizationUser = {
  id: string;
  accountStatus: string;
} | null;

type RequestRecord = NonNullable<
  Awaited<ReturnType<RequestRepository["findById"]>>
>;

export class AuthorizationService {
  constructor(
    private readonly promptRepository =
      new PromptRepository(),
    private readonly requestRepository =
      new RequestRepository(),
  ) {}

  // -------------------------
  // Prompt authorization
  // -------------------------

  async canView(
    user: AuthorizationUser,
    promptId: string,
  ): Promise<boolean> {
    const prompt =
      await this.promptRepository.findById(promptId);

    if (!prompt || prompt.deletedAt) {
      return false;
    }

    if (prompt.visibility === "public") {
      return true;
    }

    if (!user || user.accountStatus !== "active") {
      return false;
    }

    if (prompt.authorId === user.id) {
      return true;
    }

    // shared/team/organization remain fail-closed.
    return false;
  }

  async assertCanView(
    user: AuthorizationUser,
    promptId: string,
  ) {
    const prompt =
      await this.promptRepository.findById(promptId);

    if (!prompt || prompt.deletedAt) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Prompt not found",
      );
    }

    const allowed = await this.canView(user, promptId);

    if (!allowed) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Prompt not found",
      );
    }

    return prompt;
  }

  async assertCanEdit(
    user: AuthorizationUser,
    promptId: string,
  ) {
    const prompt =
      await this.promptRepository.findById(promptId);

    if (!prompt || prompt.deletedAt) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Prompt not found",
      );
    }

    if (!user) {
      throw new ApiError(
        401,
        "UNAUTHORIZED",
        "Unauthorized",
      );
    }

    if (user.accountStatus !== "active") {
      throw new ApiError(
        403,
        "FORBIDDEN",
        "You do not have permission to edit this prompt",
      );
    }

    if (prompt.authorId !== user.id) {
      throw new ApiError(
        403,
        "FORBIDDEN",
        "You do not have permission to edit this prompt",
      );
    }

    return prompt;
  }

  // -------------------------
  // Request authorization
  // -------------------------

  canViewRequest(
    user: AuthorizationUser,
    request: RequestRecord,
  ): boolean {
    // Requests are globally visible in this phase.
    // No organization/team access is assumed.
    void user;

    return !request.deletedAt;
  }

  async assertCanViewRequest(
    user: AuthorizationUser,
    requestId: string,
  ) {
    const request =
      await this.requestRepository.findById(requestId);

    if (
      !request ||
      !this.canViewRequest(user, request)
    ) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Request not found",
      );
    }

    return request;
  }

  canRespondToRequest(
    user: AuthorizationUser,
    request: RequestRecord,
  ): boolean {
    if (
      !user ||
      user.accountStatus !== "active" ||
      request.deletedAt ||
      request.status !== "open"
    ) {
      return false;
    }

    // Requesters cannot respond to their own request.
    return request.requesterId !== user.id;
  }

  async assertCanRespondToRequest(
    user: AuthorizationUser,
    requestId: string,
  ) {
    const request =
      await this.requestRepository.findById(requestId);

    if (!request || request.deletedAt) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Request not found",
      );
    }

    if (!user) {
      throw new ApiError(
        401,
        "UNAUTHORIZED",
        "Unauthorized",
      );
    }

    if (user.accountStatus !== "active") {
      throw new ApiError(
        403,
        "FORBIDDEN",
        "Your account cannot respond to requests",
      );
    }

    if (request.status !== "open") {
      throw new ApiError(
        409,
        "REQUEST_NOT_OPEN",
        "This request is no longer open",
      );
    }

    if (request.requesterId === user.id) {
      throw new ApiError(
        403,
        "FORBIDDEN",
        "You cannot respond to your own request",
      );
    }

    return request;
  }

  async assertCanAcceptResponse(
    user: AuthorizationUser,
    requestId: string,
  ) {
    const request =
      await this.requestRepository.findById(requestId);

    if (!request || request.deletedAt) {
      throw new ApiError(
        404,
        "NOT_FOUND",
        "Request not found",
      );
    }

    if (!user) {
      throw new ApiError(
        401,
        "UNAUTHORIZED",
        "Unauthorized",
      );
    }

    if (user.accountStatus !== "active") {
      throw new ApiError(
        403,
        "FORBIDDEN",
        "Your account cannot accept responses",
      );
    }

    if (request.requesterId !== user.id) {
      throw new ApiError(
        403,
        "FORBIDDEN",
        "Only the requester can accept a response",
      );
    }

    if (request.status !== "open") {
      throw new ApiError(
        409,
        "REQUEST_NOT_OPEN",
        "Only open requests can accept a response",
      );
    }

    return request;
  }

  async assertCanEditRequest(
    user: AuthorizationUser,
    requestId: string,
    action: "edit" | "close" | "delete" = "edit",
  ) {
    const request = await this.requestRepository.findById(requestId);

    if (!request || request.deletedAt) {
      throw new ApiError(404, "NOT_FOUND", "Request not found");
    }

    if (!user) {
      throw new ApiError(401, "UNAUTHORIZED", "Unauthorized");
    }

    if (user.accountStatus !== "active") {
      throw new ApiError(
        403,
        "FORBIDDEN",
        `Your account cannot ${action} requests`,
      );
    }

    if (request.requesterId !== user.id) {
      throw new ApiError(
        403,
        "FORBIDDEN",
        `Only the requester can ${action} this request`,
      );
    }

    if (request.status !== "open") {
      const message = action === "edit"
        ? "Only open requests can be edited"
        : action === "close"
          ? "Only open requests can be closed"
          : "Only open requests can be deleted";

      throw new ApiError(409, "REQUEST_NOT_OPEN", message);
    }

    return request;
  }
}

export const authorizationService =
  new AuthorizationService();
