
"use client";

import { useQuery } from "@tanstack/react-query";

import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";

import { getPromptDetail } from "../api/prompt-version.api";
import type { PromptDetail } from "../types/prompt";

export function usePromptDetail(promptId: string) {
  const { api, isLoaded, isSignedIn } = useApi();

  return useQuery<PromptDetail, ApiError>({
    queryKey: queryKeys.prompts.detail(promptId),

    queryFn: () => getPromptDetail(api, promptId),

    enabled:
      isLoaded &&
      Boolean(isSignedIn) &&
      Boolean(promptId),
  });
}
