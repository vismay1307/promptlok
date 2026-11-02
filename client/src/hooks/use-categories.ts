"use client";

import { useQuery } from "@tanstack/react-query";

import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import type { ApiSuccess } from "@/lib/types/api";
import type { Category } from "@/lib/types/taxonomy";

export function useCategories() {
  const { api, isLoaded, isSignedIn } = useApi();

  return useQuery<Category[], ApiError>({
    queryKey: queryKeys.categories(),

    queryFn: async () => {
      const response = await api.get<ApiSuccess<Category[]>>(
        "/categories",
      );

      return response.data.data;
    },

    enabled: isLoaded && Boolean(isSignedIn),
  });
}