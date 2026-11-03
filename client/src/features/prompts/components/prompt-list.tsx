
"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import type { PromptLifecycleStatus } from "@/lib/query-keys";

import { useMyPrompts } from "../hooks/use-my-prompts";
import { PromptCard } from "./prompt-card";

export function PromptList() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<PromptLifecycleStatus | "">("");

  const filters = useMemo(
    () => ({
      ...(categoryId ? { categoryId } : {}),
      ...(status ? { lifecycleStatus: status } : {}),
    }),
    [categoryId, status],
  );

  const {
    data: prompts,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyPrompts(filters);

  const {
    data: categories,
    isLoading: isCategoriesLoading,
  } = useCategories();

  const filteredPrompts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return prompts ?? [];

    return (prompts ?? []).filter((prompt) => {
      const title = prompt.title.toLowerCase();
      const description = prompt.description?.toLowerCase() ?? "";

      return (
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch)
      );
    });
  }, [prompts, search]);

  const hasActiveFilters = Boolean(search || categoryId || status);

  function clearFilters() {
    setSearch("");
    setCategoryId("");
    setStatus("");
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
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
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 p-6 text-center">
        <h3 className="font-semibold">Unable to load your prompts</h3>
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
    );
  }

  return (
    <section className="space-y-5">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Your Library</h2>
          <p className="text-sm text-muted-foreground">
            {filteredPrompts.length}{" "}
            {filteredPrompts.length === 1 ? "prompt" : "prompts"}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or description..."
            aria-label="Search prompts"
            className="sm:col-span-1"
          />

          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            aria-label="Filter by category"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All categories</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as PromptLifecycleStatus | "")
            }
            aria-label="Filter by status"
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {filteredPrompts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <h3 className="text-lg font-semibold">
            {hasActiveFilters ? "No matching prompts" : "Your library is empty"}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {hasActiveFilters
              ? "Try changing your search or filters."
              : "You haven't created any prompts yet. Create your first prompt to start building your personal library."}
          </p>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPrompts.map((prompt) => {
            const category = categories?.find(
              (item) => item.id === prompt.categoryId,
            );

            return (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                categoryName={
                  isCategoriesLoading
                    ? "Loading category..."
                    : category?.name
                }
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
