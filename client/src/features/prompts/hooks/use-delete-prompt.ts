
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";

import { deletePrompt } from "../api/prompt.api";

type DeletePromptVariables = {
  promptId: string;
};

export function useDeletePrompt() {
  const { api } = useApi();
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, DeletePromptVariables>({
    mutationFn: ({ promptId }) => deletePrompt(api, promptId),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.prompts.detail(variables.promptId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.prompts.all(),
        }),
      ]);
    },

    onError: async (error, variables) => {
      // A 404 means this prompt may already have been deleted
      // from another tab or session. Refresh cached prompt data.
      if (error.status === 404) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryKeys.prompts.detail(variables.promptId),
          }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.prompts.all(),
          }),
        ]);
      }
    },
  });
}
