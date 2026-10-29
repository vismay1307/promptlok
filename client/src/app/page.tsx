"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ApiError } from "@/lib/api-error";
import { queryKeys } from "@/lib/query-keys";
import { useApi } from "@/hooks/use-api";

export default function Home() {
  const { api, isLoaded, isSignedIn } = useApi();

  // Authenticated request: automatically fetches /api/auth/me.
  const meQuery = useQuery<unknown, ApiError>({
    queryKey: queryKeys.me(),
    queryFn: async () => {
      const response = await api.get<unknown>("/auth/me");
      return response.data;
    },
    enabled: isLoaded && Boolean(isSignedIn),
  });

  // Diagnostic request: lets us test the signed-out 401 case.
  const unauthenticatedProbe = useMutation<unknown, ApiError>({
    mutationFn: async () => {
      const response = await api.get<unknown>("/auth/me");
      return response.data;
    },
  });

  const isRunning =
    !isLoaded ||
    (Boolean(isSignedIn) && meQuery.isFetching) ||
    (!isSignedIn && unauthenticatedProbe.isPending);

  const activeError = isSignedIn
    ? meQuery.error
    : unauthenticatedProbe.error;

  const responseData = isSignedIn
    ? meQuery.data
    : unauthenticatedProbe.data;

  const hasResponse = responseData !== undefined;

  function runTest() {
    if (isSignedIn) {
      void meQuery.refetch();
      return;
    }

    unauthenticatedProbe.reset();
    unauthenticatedProbe.mutate();
  }

  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">PromptLok</h1>
            <p className="text-sm text-muted-foreground">
              FE-1 · API integration harness
            </p>
          </div>

          {isLoaded && isSignedIn ? (
            <UserButton />
          ) : (
            <div className="flex gap-4 text-sm">
              <Link href="/sign-in" className="underline">
                Sign in
              </Link>
              <Link href="/sign-up" className="underline">
                Create account
              </Link>
            </div>
          )}
        </header>

        <section className="space-y-3 rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold">Authentication status</h2>

          <p aria-live="polite" className="text-sm">
            {!isLoaded
              ? "Loading Clerk session..."
              : isSignedIn
                ? "Signed in — authenticated API request enabled."
                : "Signed out — you can test the expected 401 response."}
          </p>

          <button
            type="button"
            onClick={runTest}
            disabled={!isLoaded || isRunning}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRunning
              ? "Testing..."
              : isSignedIn
                ? "Retry /api/auth/me"
                : "Test unauthenticated request"}
          </button>
        </section>

        {activeError && (
          <section
            role="alert"
            className="space-y-3 rounded-xl border border-destructive/40 p-6"
          >
            <h2 className="font-semibold">API request failed</h2>

            <p className="text-sm text-muted-foreground">
              {activeError.message}
            </p>

            <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
              {JSON.stringify(
                {
                  status: activeError.status,
                  code: activeError.code,
                  message: activeError.message,
                  fieldErrors: activeError.fieldErrors,
                },
                null,
                2,
              )}
            </pre>
          </section>
        )}

        {hasResponse && (
          <section className="space-y-3 rounded-xl border border-border p-6">
            <h2 className="font-semibold">API response</h2>

            <pre className="overflow-x-auto whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </section>
        )}

        <p className="text-xs text-muted-foreground">
          Temporary development page. Session tokens and secret values are
          never displayed.
        </p>
      </div>
    </main>
  );
}