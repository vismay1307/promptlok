import { PageHeader } from "@/components/common/page-header";
import { requireAuth } from "@/lib/auth/require-auth";

export default async function VaultPage() {
  await requireAuth();

  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Your Library"
          title="My Prompts"
          description="Manage and organize your saved AI prompts."
        />
      </div>
    </main>
  );
}