
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";

import { restorePromptVersion } from "../api/prompt-version.api";
import type { PromptVersion } from "../types/prompt-version";

type RestoreVersionVariables = {
  promptId: string;
  versionId: string;
};

export function useRestorePromptVersion() {
  const { api } = useApi();
  const queryClient = useQueryClient();

  return useMutation<
    PromptVersion,
    ApiError,
    RestoreVersionVariables
  >({
    mutationFn: ({ promptId, versionId }) =>
      restorePromptVersion(api, promptId, versionId),

    onSuccess: async (_version, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.prompts.detail(variables.promptId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.prompts.versions(variables.promptId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.prompts.all(),
        }),
      ]);
    },
  });
}
