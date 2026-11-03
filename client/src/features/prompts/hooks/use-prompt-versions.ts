
"use client";

import { useQuery } from "@tanstack/react-query";

import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";

import { getPromptVersions } from "../api/prompt-version.api";
import type { PromptVersionHistoryItem } from "../types/prompt-version";

export function usePromptVersions(promptId: string) {
  const { api, isLoaded, isSignedIn } = useApi();

  return useQuery<PromptVersionHistoryItem[], ApiError>({
    queryKey: queryKeys.prompts.versions(promptId),

    queryFn: () => getPromptVersions(api, promptId),

    enabled:
      isLoaded &&
      Boolean(isSignedIn) &&
      Boolean(promptId),
  });
}
