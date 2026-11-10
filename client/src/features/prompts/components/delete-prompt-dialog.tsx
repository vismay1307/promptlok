
"use client";

import { useRef } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-error";

import { useDeletePrompt } from "../hooks/use-delete-prompt";

type DeletePromptDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptId: string;
  promptTitle: string;
  onDeleted?: () => void;
};

export function DeletePromptDialog({
  open,
  onOpenChange,
  promptId,
  promptTitle,
  onDeleted,
}: DeletePromptDialogProps) {
  const deletePromptMutation = useDeletePrompt();

  const isPending = deletePromptMutation.isPending;

  // Prevent multiple requests from rapid repeated clicks.
  const requestInProgress = useRef(false);

  async function handleDelete() {
    if (requestInProgress.current || isPending) {
      return;
    }

    requestInProgress.current = true;

    try {
      await deletePromptMutation.mutateAsync({ promptId });

      toast.success("Prompt deleted successfully.");

      onOpenChange(false);
      onDeleted?.();
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        toast.info(
          "This prompt has already been deleted. Your list has been refreshed.",
        );

        onOpenChange(false);
        onDeleted?.();

        return;
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete prompt. Please try again.",
      );
    } finally {
      requestInProgress.current = false;
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending || requestInProgress.current) {
      return;
    }

    onOpenChange(nextOpen);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete this prompt?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">
              {promptTitle}
            </strong>
            ?

            This prompt will be removed from your list.
            There is currently no option to restore it.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Prompt"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
