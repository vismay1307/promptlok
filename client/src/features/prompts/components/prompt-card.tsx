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

function getStatusClasses(status: Prompt["lifecycleStatus"]) {
  switch (status) {
    case "draft":
      return "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300";

    case "active":
      return "border-green-600/30 bg-green-600/10 text-green-800 dark:text-green-300";

    case "archived":
      return "border-border bg-muted text-muted-foreground";

    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

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
      <Card className="group/prompt relative border border-border transition-[border-color,box-shadow] duration-150 hover:border-border-hover hover:shadow-sm active:border-primary-active motion-reduce:transition-none">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusClasses(prompt.lifecycleStatus)}`}
            >
              {prompt.lifecycleStatus === "draft" && (
                <span className="size-1.5 rounded-full bg-current" />
              )}
              {prompt.lifecycleStatus}
            </span>

            <div className="flex shrink-0 items-center gap-2">
              <span className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {prompt.promptType}
              </span>

              <div className="relative z-20">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label={`Actions for ${prompt.title}`}
                    className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
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
            </div>
          </div>

          <Link
            href={`/vault/${prompt.id}`}
            aria-label={`View prompt: ${prompt.title}`}
            className="block space-y-2 rounded-sm outline-none after:absolute after:inset-0 after:z-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring"
          >
            <CardTitle className="line-clamp-2 text-base font-semibold leading-snug transition-colors group-hover/prompt:text-primary">
              {prompt.title}
            </CardTitle>

            <CardDescription className="line-clamp-2 min-h-10 text-sm leading-relaxed">
              {prompt.description?.trim() || "No description added."}
            </CardDescription>
          </Link>
        </CardHeader>

        <CardContent>
          {showCategory && (
            <div className="mb-3">
              <span className="inline-flex max-w-full truncate rounded-full border border-border-subtle px-2.5 py-1 text-xs text-muted-foreground">
                {categoryName ?? "Uncategorized"}
              </span>
            </div>
          )}

          <div className="flex min-w-0 items-center justify-between gap-3 border-t border-border-subtle pt-3 text-xs text-muted-foreground">
            <span
              className="min-w-0 truncate"
              title={prompt.aiModelMetadata || "No AI model specified"}
            >
              {prompt.aiModelMetadata || "No AI model specified"}
            </span>

            <span className="shrink-0">Created {formattedDate}</span>
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