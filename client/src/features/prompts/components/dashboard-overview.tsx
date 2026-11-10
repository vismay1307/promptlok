
"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useMyPrompts } from "../hooks/use-my-prompts";
import { PromptCard } from "./prompt-card";

export function DashboardOverview() {
  const {
    data: prompts,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyPrompts({ limit: 5 });

  return (
    <section className="space-y-8">
      {/* Welcome and primary action */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">
            Your workspace
          </p>

          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome to PromptLok
          </h2>

          <p className="max-w-xl text-sm text-muted-foreground">
            Create, organize and manage your AI prompts in one place.
          </p>
        </div>

        <Link
          href="/vault/new"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Plus className="mr-2 size-4" />
          New Prompt
        </Link>
      </div>

      {/* Recent prompts */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Recent Prompts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your five most recently created prompts.
            </p>
          </div>

          <Link
            href="/vault"
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View all prompts
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="space-y-3 rounded-xl border border-border p-5"
              >
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="rounded-xl border border-destructive/30 p-6 text-center">
            <h3 className="font-semibold">
              Unable to load recent prompts
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {error.message || "Something went wrong. Please try again."}
            </p>

            <Button
              type="button"
              className="mt-4"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Retrying..." : "Try again"}
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && prompts?.length === 0 && (
          <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
            <h3 className="text-lg font-semibold">
              Your workspace is waiting
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              You haven&apos;t created any prompts yet.
              Start building your personal library.
            </p>

            <Link
              href="/vault/new"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Plus className="mr-2 size-4" />
              Create your first prompt
            </Link>
          </div>
        )}

        {/* Recent prompt cards */}
        {!isLoading && !isError && prompts && prompts.length > 0 && (
          <div className="grid gap-4">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                showCategory={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
