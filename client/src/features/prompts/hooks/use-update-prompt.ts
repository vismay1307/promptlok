
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";

import { updatePrompt } from "../api/prompt.api";
import type {
  Prompt,
  UpdatePromptInput,
} from "../types/prompt";

type UpdatePromptVariables = {
  promptId: string;
  payload: UpdatePromptInput;
};

export function useUpdatePrompt() {
  const { api } = useApi();
  const queryClient = useQueryClient();

  return useMutation<
    Prompt,
    ApiError,
    UpdatePromptVariables
  >({
    mutationFn: ({ promptId, payload }) =>
      updatePrompt(api, promptId, payload),

    onSuccess: async (_updatedPrompt, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.prompts.detail(
            variables.promptId,
          ),
        }),

        queryClient.invalidateQueries({
          queryKey: queryKeys.prompts.all(),
        }),
      ]);
    },
  });
}
