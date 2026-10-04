import { ApiError } from "../utils/ApiError.js";
import { PromptRepository } from "../repositories/prompt.repository.js";

export type AuthorizationUser = {
  id: string;
  accountStatus: string;
} | null;

export class AuthorizationService {
  constructor(
    private readonly promptRepository = new PromptRepository(),
  ) {}

  async canView(
  user: AuthorizationUser,
  promptId: string,
): Promise<boolean> {
  const prompt = await this.promptRepository.findById(promptId);

  // Missing prompt or soft-deleted prompt = not viewable
  if (!prompt || prompt.deletedAt) {
    return false;
  }

  // Public prompts are viewable by everyone
  if (prompt.visibility === "public") {
    return true;
  }

  // Non-public prompts require an authenticated user
  if (!user) {
    return false;
  }

  // Inactive users cannot access protected prompts
  if (user.accountStatus !== "active") {
    return false;
  }

  // Owner can view their own prompt
  if (prompt.authorId === user.id) {
    return true;
  }

  // shared/team/organization are fail-closed for now
  return false;
}

  async assertCanView(
    user: AuthorizationUser,
    promptId: string,
  ) {
    const prompt = await this.promptRepository.findById(promptId);

    if (!prompt || prompt.deletedAt) {
      throw new ApiError(404,"404", "Prompt not found");
    }

    const allowed = await this.canView(user, promptId);

    if (!allowed) {
      throw new ApiError(404, "404","Prompt not found");
    }

    return prompt;
  }

  async assertCanEdit(
    user: AuthorizationUser,
    promptId: string,
  ) {
    const prompt = await this.promptRepository.findById(promptId);

    if (!prompt || prompt.deletedAt) {
      throw new ApiError(404,"404", "Prompt not found");
    }

    if (!user) {
      throw new ApiError(404,"404", "Prompt not found");
    }

    if (user.accountStatus !== "active") {
      throw new ApiError(404, "404","Prompt not found");
    }

    if (prompt.authorId !== user.id) {
      throw new ApiError(404, "404","Prompt not found");
    }

    return prompt;
  }
}

export const authorizationService = new AuthorizationService();