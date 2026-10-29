import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api-error";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,

        retry: (failureCount, error) => {
          if (
            error instanceof ApiError &&
            error.status !== null &&
            error.status < 500
          ) {
            return false;
          }

          // Retry network/server failures at most once.
          return failureCount < 1;
        },
      },

      mutations: {
        retry: false,
      },
    },
  });
}