"use client";

import { useQuery } from "@tanstack/react-query";

import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api-error";
import { queryKeys, type PromptListFilters } from "@/lib/query-keys";
import type { ApiSuccess } from "@/lib/types/api";

import type { Prompt } from "../types/prompt";

export function useMyPrompts(filters: PromptListFilters = {}) {
  const { api, isLoaded, isSignedIn } = useApi();

  return useQuery<Prompt[], ApiError>({
    queryKey: queryKeys.prompts.mine(filters),

    queryFn: async () => {
      const response = await api.get<ApiSuccess<Prompt[]>>(
        "/prompts/mine",
        {
          params: filters,
        },
      );

      return response.data.data;
    },

    enabled: isLoaded && Boolean(isSignedIn),
  });
}