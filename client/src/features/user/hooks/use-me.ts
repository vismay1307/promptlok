"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api-error";
import type { ApiSuccess } from "@/lib/types/api";
import type { CurrentUser } from "@/lib/types/user";
import { queryKeys } from "@/lib/query-keys";

export function useMe() {
  const { api, isLoaded, isSignedIn } = useApi();

  return useQuery<CurrentUser, ApiError>({
    queryKey: queryKeys.me(),

    queryFn: async () => {
      const response = await api.get<ApiSuccess<CurrentUser>>(
        "/auth/me",
      );

      return response.data.data;
    },

    enabled: isLoaded && Boolean(isSignedIn),
  });
}