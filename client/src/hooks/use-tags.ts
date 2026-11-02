"use client";

import { useQuery } from "@tanstack/react-query";

import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import type { ApiSuccess } from "@/lib/types/api";
import type { Tag } from "@/lib/types/taxonomy";

export function useTags(query?: string) {
  const { api, isLoaded, isSignedIn } = useApi();

  const searchQuery = query?.trim() ?? "";

  return useQuery<Tag[], ApiError>({
    queryKey: queryKeys.tags(searchQuery),

    queryFn: async () => {
      const response = await api.get<ApiSuccess<Tag[]>>(
        "/tags",
        {
          params: searchQuery ? { q: searchQuery } : undefined,
        },
      );

      return response.data.data;
    },

    enabled: isLoaded && Boolean(isSignedIn),
  });
}