
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import type { ApiSuccess } from "@/lib/types/api";

import type {
  CreatePromptInput,
  Prompt,
} from "../types/prompt";

export function useCreatePrompt() {
  const { api } = useApi();
  const queryClient = useQueryClient();

  return useMutation<Prompt, ApiError, CreatePromptInput>({
    mutationFn: async (payload) => {
      const response = await api.post<ApiSuccess<Prompt>>(
        "/prompts",
        payload,
      );

      return response.data.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.prompts.all(),
      });
    },
  });
}
