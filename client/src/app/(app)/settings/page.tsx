
import { PageHeader } from "@/components/common/page-header";
import { SettingsProfile } from "@/features/user/components/settings-profile";
import { requireAuth } from "@/lib/auth/require-auth";

export default async function SettingsPage() {
  await requireAuth();

  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <PageHeader
          eyebrow="Account"
          title="Settings"
          description="View your profile and account information."
        />

        <SettingsProfile />
      </div>
    </main>
  );
}
