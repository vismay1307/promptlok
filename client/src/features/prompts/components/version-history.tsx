
"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, History, Loader2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

import {
  createPromptVersionSchema,
  type CreatePromptVersionInput,
  type PromptVersion,
} from "@/features/prompts/types/prompt-version";

import { usePromptVersions } from "@/features/prompts/hooks/use-prompt-versions";
import { usePromptVersion } from "@/features/prompts/hooks/use-prompt-version";
import { useCreatePromptVersion } from "@/features/prompts/hooks/use-create-prompt-version";
import { useRestorePromptVersion } from "@/features/prompts/hooks/use-restore-prompt-version";

type VersionHistoryProps = {
  promptId: string;
  currentVersion: PromptVersion | null;
  canEdit: boolean;
};

export function VersionHistory({
  promptId,
  currentVersion,
  canEdit,
}: VersionHistoryProps) {
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    null,
  );

  const [restoreTarget, setRestoreTarget] = useState<{
    id: string;
    versionNumber: number;
  } | null>(null);

  const {
    data: versions,
    isLoading: isVersionsLoading,
    isError: isVersionsError,
    refetch: refetchVersions,
  } = usePromptVersions(promptId);

  const {
    data: selectedVersion,
    isLoading: isSelectedVersionLoading,
    isError: isSelectedVersionError,
    refetch: refetchSelectedVersion,
  } = usePromptVersion(promptId, selectedVersionId ?? "");

  // Mutation hooks do not receive promptId as an argument.
  const createVersion = useCreatePromptVersion();
  const restoreVersion = useRestorePromptVersion();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreatePromptVersionInput>({
    resolver: zodResolver(createPromptVersionSchema),
    defaultValues: {
      content: currentVersion?.content ?? "",
      changeNote: "",
    },
  });

  // useWatch subscribes to content changes without using RHF's watch().
  const watchedContent = useWatch({
    control,
    name: "content",
  });

  const currentContent = currentVersion?.content ?? "";
  const editorContent = watchedContent ?? "";

  const hasContentChanged = editorContent !== currentContent;

  const onCreateVersion = async (values: CreatePromptVersionInput) => {
    if (!hasContentChanged) {
      toast.info("No changes detected. Update the prompt content first.");
      return;
    }

    try {
      await createVersion.mutateAsync({
        promptId,
        payload: {
          content: values.content,
          ...(values.changeNote?.trim()
            ? { changeNote: values.changeNote.trim() }
            : {}),
        },
      });

      toast.success("New prompt version created.");

      // Reset the editor after successful creation.
      reset({
        content: values.content,
        changeNote: "",
      });

      setSelectedVersionId(null);
    } catch {
      toast.error("Failed to create a new version. Please try again.");
    }
  };

  const onRestoreVersion = async () => {
    if (!restoreTarget) return;

    try {
      const restoredVersion = await restoreVersion.mutateAsync({
        promptId,
        versionId: restoreTarget.id,
      });

      toast.success(
        `Version ${restoreTarget.versionNumber} restored as a new version.`,
      );

      // The restore API returns the newly created version.
      reset({
        content: restoredVersion.content,
        changeNote: "",
      });

      setSelectedVersionId(null);
      setRestoreTarget(null);
    } catch {
      toast.error("Failed to restore this version. Please try again.");
    }
  };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));

  return (
    <div className="space-y-6">
      {/* Create New Version */}
      {canEdit && (
        <Card>
          <CardHeader>
            <CardTitle>Create a New Version</CardTitle>
            <CardDescription>
              Update the prompt content and save it as a new version.
              Previous versions will remain unchanged.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onCreateVersion)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="version-content">Prompt Content</Label>

                <Textarea
                  id="version-content"
                  placeholder="Write your updated prompt content..."
                  rows={10}
                  {...register("content")}
                  aria-invalid={Boolean(errors.content)}
                />

                {errors.content && (
                  <p className="text-sm text-destructive">
                    {errors.content.message}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  {editorContent.length} / 20,000 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="change-note">
                  Change Note{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>

                <Input
                  id="change-note"
                  placeholder="e.g. Improved instructions and added examples"
                  maxLength={500}
                  {...register("changeNote")}
                  aria-invalid={Boolean(errors.changeNote)}
                />

                {errors.changeNote && (
                  <p className="text-sm text-destructive">
                    {errors.changeNote.message}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="submit"
                  disabled={
                    createVersion.isPending || !hasContentChanged
                  }
                >
                  {createVersion.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save New Version"
                  )}
                </Button>

                {!hasContentChanged && (
                  <p className="text-xs text-muted-foreground">
                    Make a content change to create a new version.
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Version History */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <CardTitle>Version History</CardTitle>
          </div>

          <CardDescription>
            Browse previous versions of this prompt.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isVersionsLoading && (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          )}

          {isVersionsError && (
            <div className="space-y-3">
              <p className="text-sm text-destructive">
                Unable to load version history.
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetchVersions()}
              >
                Retry
              </Button>
            </div>
          )}

          {!isVersionsLoading &&
            !isVersionsError &&
            (!versions || versions.length === 0) && (
              <p className="text-sm text-muted-foreground">
                No version history available.
              </p>
            )}

          {!isVersionsLoading &&
            !isVersionsError &&
            versions?.map((version) => {
              const isCurrent = version.id === currentVersion?.id;
              const isSelected = version.id === selectedVersionId;

              return (
                <div
                  key={version.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        Version {version.versionNumber}
                      </p>

                      {isCurrent && (
                        <Badge variant="default">Current</Badge>
                      )}

                      {isSelected && (
                        <Badge variant="secondary">Viewing</Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {formatDate(version.createdAt)}
                    </p>

                    {version.changeNote && (
                      <p className="text-sm text-muted-foreground">
                        {version.changeNote}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setSelectedVersionId(
                          isCurrent ? null : version.id,
                        )
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {isSelected ? "Selected" : "View"}
                    </Button>

                    {canEdit && !isCurrent && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setRestoreTarget({
                            id: version.id,
                            versionNumber: version.versionNumber,
                          })
                        }
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* Selected Historical Version */}
      {selectedVersionId && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Version Content</CardTitle>
            <CardDescription>
              Read-only content of the selected historical version.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {isSelectedVersionLoading && (
              <Skeleton className="h-48 w-full" />
            )}

            {isSelectedVersionError && (
              <div className="space-y-3">
                <p className="text-sm text-destructive">
                  Unable to load this version.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => refetchSelectedVersion()}
                >
                  Retry
                </Button>
              </div>
            )}

            {!isSelectedVersionLoading &&
              !isSelectedVersionError &&
              selectedVersion && (
                <Textarea
                  value={selectedVersion.content}
                  readOnly
                  rows={12}
                  className="font-mono text-sm"
                />
              )}
          </CardContent>
        </Card>
      )}

      {/* Restore Confirmation */}
      <ConfirmDialog
        open={Boolean(restoreTarget)}
        onOpenChange={(open) => {
          if (!open) setRestoreTarget(null);
        }}
        title="Restore this version?"
        description={
          <>
            This will create a new version using the content from Version{" "}
            <strong>{restoreTarget?.versionNumber}</strong>. Existing version
            history will remain unchanged.
          </>
        }
        confirmLabel="Restore Version"
        loadingLabel="Restoring..."
        isLoading={restoreVersion.isPending}
        onConfirm={onRestoreVersion}
      />
    </div>
  );
}
