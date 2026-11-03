
import { requireAuth } from "@/lib/auth/require-auth";

import { PromptDetail } from "@/features/prompts/components/prompt-detail";

type PromptDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PromptDetailPage({
  params,
}: PromptDetailPageProps) {
  await requireAuth();

  const { id } = await params;

  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <PromptDetail promptId={id} />
      </div>
    </main>
  );
}
