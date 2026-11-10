
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { CreatePromptForm } from "@/features/prompts/components/create-prompt-form";
import { requireAuth } from "@/lib/auth/require-auth";

export default async function NewPromptPage() {
  await requireAuth();

  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <Link
          href="/vault"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ArrowLeft className="size-4" />
          Back to My Prompts
        </Link>

        <CreatePromptForm />
      </div>
    </main>
  );
}
