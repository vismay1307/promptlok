
"use client";

import { useQuery } from "@tanstack/react-query";

import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";

import { getPromptVersion } from "../api/prompt-version.api";
import type { PromptVersion } from "../types/prompt-version";

export function usePromptVersion(
  promptId: string,
  versionId: string,
) {
  const { api, isLoaded, isSignedIn } = useApi();

  return useQuery<PromptVersion, ApiError>({
    queryKey: queryKeys.prompts.version(promptId, versionId),

    queryFn: () => getPromptVersion(api, promptId, versionId),

    enabled:
      isLoaded &&
      Boolean(isSignedIn) &&
      Boolean(promptId) &&
      Boolean(versionId),
  });
}
