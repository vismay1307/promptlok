import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { HeroSection } from "@/features/landing/components/hero-section";
import { WhySection } from "@/features/landing/components/why-section";
import { WhatSection } from "@/features/landing/components/what-section";
import { PricingSection } from "@/features/landing/components/pricing-section";
import { LandingFooter } from "@/features/landing/components/landing-footer";

export const metadata: Metadata = {
  title: "PromptLok — Save, Organize and Share AI Prompts",
  description:
    "Save, organize, version, and discover AI prompts in one place. Build your personal library, learn from the community, and share trusted prompts with your team.",
};

export default async function HomePage() {
  const { userId } = await auth();

  // Signed-in users go straight to the dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <>
      <LandingNavbar />
      <main id="main-content">
        <HeroSection />
        <WhySection />
        <WhatSection />
        <PricingSection />
      </main>
      <LandingFooter />
    </>
  );
}
