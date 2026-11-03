
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";

import { createPromptVersion } from "../api/prompt-version.api";
import type {
  CreatePromptVersionInput,
  PromptVersion,
} from "../types/prompt-version";

type CreateVersionVariables = {
  promptId: string;
  payload: CreatePromptVersionInput;
};

export function useCreatePromptVersion() {
  const { api } = useApi();
  const queryClient = useQueryClient();

  return useMutation<
    PromptVersion,
    ApiError,
    CreateVersionVariables
  >({
    mutationFn: ({ promptId, payload }) =>
      createPromptVersion(api, promptId, payload),

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
