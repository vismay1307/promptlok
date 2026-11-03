
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Prompt } from "../types/prompt";

type PromptCardProps = {
  prompt: Prompt;
  categoryName?: string;
};

export function PromptCard({
  prompt,
  categoryName,
}: PromptCardProps) {
  const createdAt = new Date(prompt.createdAt);

  const formattedDate = Number.isNaN(createdAt.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(createdAt);

  return (
    <Link
      href={`/vault/${prompt.id}`}
      className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`View prompt: ${prompt.title}`}
    >
      <Card className="transition-colors hover:border-primary/40 hover:shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize text-muted-foreground">
              {prompt.lifecycleStatus}
            </span>

            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {prompt.promptType.toUpperCase()}
            </span>

            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {categoryName ?? "Uncategorized"}
            </span>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-lg">
              {prompt.title}
            </CardTitle>

            <CardDescription>
              {prompt.description?.trim() ||
                "No description added."}
            </CardDescription>
          </div>
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
    </Link>
  );
}
