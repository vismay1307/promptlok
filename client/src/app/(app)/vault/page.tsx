
import Link from "next/link";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { PromptList } from "@/features/prompts/components/prompt-list";
import { requireAuth } from "@/lib/auth/require-auth";

export default async function VaultPage() {
  await requireAuth();

  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <PageHeader
          eyebrow="Your Library"
          title="My Prompts"
          description="Manage and organize your saved AI prompts."
         actions={
  <Link
    href="/vault/new"
    className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
  >
    <Plus className="size-4 shrink-0" />
    <span>New Prompt</span>
  </Link>
}
        />

        <PromptList />
      </div>
    </main>
  );
}
