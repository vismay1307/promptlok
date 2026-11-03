
export type PromptLifecycleStatus = "draft" | "active" | "archived";

export type PromptListFilters = {
  limit?: number;
  offset?: number;
  categoryId?: string;
  lifecycleStatus?: PromptLifecycleStatus;
};

export const queryKeys = {
  all: ["promptlok"] as const,

  me: () => [...queryKeys.all, "me"] as const,

  categories: () => [...queryKeys.all, "categories"] as const,

  tags: (query?: string) =>
    [...queryKeys.all, "tags", query?.trim() ?? ""] as const,

  prompts: {
    all: () => [...queryKeys.all, "prompts"] as const,

    mine: (filters: PromptListFilters = {}) =>
      [...queryKeys.all, "prompts", "mine", filters] as const,

    detail: (id: string) =>
      [...queryKeys.all, "prompts", "detail", id] as const,

    versions: (id: string) =>
      [...queryKeys.all, "prompts", "versions", id] as const,

    version: (id: string, versionId: string) =>
      [...queryKeys.all, "prompts", "versions", id, versionId] as const,
  },
};
