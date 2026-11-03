
"use client";

import Link from "next/link";
import { useState } from "react";
import { VersionHistory } from "./version-history";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";

import { usePromptDetail } from "../hooks/use-prompt-detail";

type PromptDetailProps = {
  promptId: string;
};

export function PromptDetail({ promptId }: PromptDetailProps) {
  const [copied, setCopied] = useState(false);

  const {
    data: prompt,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = usePromptDetail(promptId);

  const { data: categories } = useCategories();

  async function handleCopyContent() {
    const content = prompt?.currentVersion?.content;

    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !prompt) {
    return (
      <div className="space-y-5">
        <Link
          href="/vault"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Vault
        </Link>

        <div className="rounded-xl border border-destructive/30 p-8 text-center">
          <h2 className="text-lg font-semibold">
            Unable to load prompt
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error?.message || "Prompt could not be found."}
          </p>

          <Button
            type="button"
            className="mt-5"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Retrying..." : "Try again"}
          </Button>
        </div>
      </div>
    );
  }

  const category = categories?.find(
    (item) => item.id === prompt.categoryId,
  );

  const currentVersion = prompt.currentVersion;

  const formattedDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(parsedDate);
  };

  return (
    <section className="space-y-8">
      <Link
        href="/vault"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Back to Vault
      </Link>

      {/* Prompt Header */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
            {prompt.lifecycleStatus}
          </span>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {prompt.promptType.toUpperCase()}
          </span>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {category?.name ?? "Uncategorized"}
          </span>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize text-muted-foreground">
            {prompt.visibility}
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {prompt.title}
          </h1>

          <p className="max-w-3xl text-muted-foreground">
            {prompt.description || "No description added."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={handleCopyContent}
            disabled={!currentVersion?.content}
          >
            {copied ? "Copied!" : "Copy prompt"}
          </Button>

          <span className="text-sm text-muted-foreground">
            {prompt.canEdit ? "You can edit this prompt" : "View only"}
          </span>
        </div>
      </div>

      {/* Current Version */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <CardTitle>Prompt Content</CardTitle>
              <CardDescription>
                The content of your current prompt version.
              </CardDescription>
            </div>

            {currentVersion && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Version {currentVersion.versionNumber}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {currentVersion ? (
            <div className="space-y-5">
              <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-muted/40 p-5 font-mono text-sm leading-7 text-foreground">
                {currentVersion.content}
              </pre>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
                <span>
                  Updated {formattedDate(currentVersion.createdAt)}
                </span>

                <span>
                  {currentVersion.changeNote || "No change note"}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border px-5 py-10 text-center">
              <p className="font-medium">
                No current version available
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                This prompt does not have any version content yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prompt Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Prompt Information</CardTitle>
          <CardDescription>
            Additional information about this prompt.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">AI Model</p>
              <p className="text-sm font-medium">
                {prompt.aiModelMetadata || "Not specified"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="text-sm font-medium capitalize">
                {prompt.visibility}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm font-medium">
                {formattedDate(prompt.createdAt)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Last updated</p>
              <p className="text-sm font-medium">
                {formattedDate(prompt.updatedAt)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Permission</p>
              <p className="text-sm font-medium">
                {prompt.canEdit ? "Can edit" : "View only"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <VersionHistory
  promptId={promptId}
  currentVersion={currentVersion}
/>
    </section>
  );
}
