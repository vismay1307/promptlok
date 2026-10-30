"use client";

import type { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: ReactNode;

  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;

  isLoading?: boolean;
  destructive?: boolean;

  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loadingLabel = "Processing...",
  isLoading = false,
  destructive = false,
  onConfirm,
}: ConfirmDialogProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    // Prevent closing while an operation is running.
    if (isLoading) return;

    onOpenChange(nextOpen);
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            variant={destructive ? "destructive" : "default"}
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? loadingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}