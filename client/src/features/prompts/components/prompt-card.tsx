"use client";

import Link from "next/link";
import { useState } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Prompt } from "../types/prompt";
import { DeletePromptDialog } from "./delete-prompt-dialog";

type PromptCardProps = {
  prompt: Prompt;
  categoryName?: string;
  showCategory?: boolean;
};

export function PromptCard({
  prompt,
  categoryName,
  showCategory = true,
}: PromptCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const createdAt = new Date(prompt.createdAt);

  const formattedDate = Number.isNaN(createdAt.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(createdAt);

  return (
    <>
      <Card className="transition-colors hover:border-primary/40 hover:shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize text-muted-foreground">
                {prompt.lifecycleStatus}
              </span>

              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {prompt.promptType.toUpperCase()}
              </span>

              {showCategory && (
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {categoryName ?? "Uncategorized"}
                </span>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`Actions for ${prompt.title}`}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                <MoreHorizontal className="size-5" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="size-4" />
                  Delete Prompt
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link
            href={`/vault/${prompt.id}`}
            className="block space-y-1 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`View prompt: ${prompt.title}`}
          >
            <CardTitle className="text-lg transition-colors hover:text-primary">
              {prompt.title}
            </CardTitle>

            <CardDescription>
              {prompt.description?.trim() || "No description added."}
            </CardDescription>
          </Link>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
            <span>
              {prompt.aiModelMetadata || "No AI model specified"}
            </span>

            <span>Created {formattedDate}</span>
          </div>
        </CardContent>
      </Card>

      <DeletePromptDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        promptId={prompt.id}
        promptTitle={prompt.title}
      />
    </>
  );
}