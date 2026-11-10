import { PageHeader } from "@/components/common/page-header";
import { DashboardOverview } from "@/features/prompts/components/dashboard-overview";
import { requireAuth } from "@/lib/auth/require-auth";

export default async function DashboardPage() {
  await requireAuth();

  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          eyebrow="Overview"
          title="Dashboard"
          description="Welcome to your PromptLok workspace."
        />

        <DashboardOverview />
      </div>
    </main>
  );
}