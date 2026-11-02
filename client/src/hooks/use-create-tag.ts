"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useApi } from "@/hooks/use-api";
import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import type { ApiSuccess } from "@/lib/types/api";
import type { Tag } from "@/lib/types/taxonomy";

export function useCreateTag() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { api, isLoaded, isSignedIn } = useApi();
  const queryClient = useQueryClient();

  return useMutation<Tag, ApiError, string>({
    mutationFn: async (name) => {
      const response = await api.post<ApiSuccess<Tag>>(
        "/tags",
        {
          name: name.trim(),
        },
      );

      return response.data.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...queryKeys.all, "tags"],
      });
    },

    // Prevent mutation before Clerk authentication is ready.
    // The UI should also disable the create action until signed in.
  });
}