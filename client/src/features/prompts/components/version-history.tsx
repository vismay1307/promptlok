
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { usePromptVersion } from "../hooks/use-prompt-version";
import { usePromptVersions } from "../hooks/use-prompt-versions";
import type { PromptVersion } from "../types/prompt-version";

type VersionHistoryProps = {
  promptId: string;
  currentVersion: PromptVersion | null;
};

function formatDate(date: string) {
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
}

export function VersionHistory({
  promptId,
  currentVersion,
}: VersionHistoryProps) {
  const [selectedVersionId, setSelectedVersionId] =
    useState<string | null>(null);

  const {
    data: versions,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = usePromptVersions(promptId);

  const selectedVersion = usePromptVersion(
    promptId,
    selectedVersionId ?? "",
  );

  const isCurrentSelected =
    !selectedVersionId ||
    selectedVersionId === currentVersion?.id;

  const displayedVersion = isCurrentSelected
    ? currentVersion
    : selectedVersion.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
        <CardDescription>
          Browse previous versions of this prompt and inspect their content.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="space-y-2 rounded-lg border border-border p-4"
              >
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/30 p-5 text-center">
            <p className="text-sm text-muted-foreground">
              {error.message || "Unable to load version history."}
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Retrying..." : "Try again"}
            </Button>
          </div>
        ) : !versions?.length ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No version history available.
          </p>
        ) : (
          <div className="space-y-3">
            {versions.map((version) => {
              const isCurrent =
                version.id === currentVersion?.id;

              const isSelected =
                isCurrentSelected
                  ? isCurrent
                  : selectedVersionId === version.id;

              return (
                <div
                  key={version.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4 transition-colors ${
                    isSelected
                      ? "border-primary/50 bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">
                        Version {version.versionNumber}
                      </p>

                      {isCurrent && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Current
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {formatDate(version.createdAt)}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {version.changeNote || "No change note"}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant={isSelected ? "secondary" : "outline"}
                    size="sm"
                    onClick={() =>
                      setSelectedVersionId(
                        isCurrent ? null : version.id,
                      )
                    }
                  >
                    {isSelected ? "Selected" : "View"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}


        {/* Selected Version Content */}
        {(isCurrentSelected && displayedVersion) ||
        (!isCurrentSelected && selectedVersion.isLoading) ||
        (!isCurrentSelected && selectedVersion.isError) ||
        (!isCurrentSelected && selectedVersion.data) ? (
          <div className="space-y-3 border-t border-border pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">
                {displayedVersion
                  ? `Version ${displayedVersion.versionNumber} Content`
                  : "Selected Version Content"}
              </h3>

              <span className="text-xs text-muted-foreground">
                {isCurrentSelected ? "Current version" : "Historical version"}
              </span>
            </div>

            {!isCurrentSelected && selectedVersion.isLoading ? (
              <Skeleton className="h-40 w-full" />
            ) : !isCurrentSelected && selectedVersion.isError ? (
              <div className="rounded-lg border border-destructive/30 p-4">
                <p className="text-sm text-muted-foreground">
                  Unable to load this version.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => selectedVersion.refetch()}
                >
                  Try again
                </Button>
              </div>
            ) : displayedVersion ? (
              <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-muted/40 p-4 font-mono text-sm leading-7">
                {displayedVersion.content}
              </pre>
            ) : null}
          </div>
        ) : null}

      </CardContent>
    </Card>
  );
}
