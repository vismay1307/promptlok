import { PageHeader } from "@/components/common/page-header";
import { CreatePromptForm } from "@/features/prompts/components/create-prompt-form";
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
          description="Create, manage and organize your saved AI prompts."
        />

        <PromptList />

        <CreatePromptForm />
      </div>
    </main>
  );
}