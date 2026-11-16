"use client";

import { Check } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "cn";

import { PRICING_CONTENT, type PricingPlan } from "../content/landing-content";
import { SectionHeading } from "./section-heading";
import { SECTION_PRICING, SIGN_UP_HREF, DASHBOARD_HREF, CONTACT_SALES_HREF } from "../config/landing-config";

function PricingCta({
  plan,
  isSignedIn,
}: {
  plan: PricingPlan;
  isSignedIn: boolean | null | undefined;
}) {
  const href = isSignedIn ? DASHBOARD_HREF : SIGN_UP_HREF;
  const isPro = plan.variant === "pro";

  return (
    <Link
      href={href}
      className={cn(
        "mt-auto flex h-11 w-full items-center justify-center rounded-full text-sm font-medium font-[inherit] transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isPro
          ? "bg-primary text-primary-foreground border border-primary-border hover:bg-primary-hover active:bg-primary-active"
          : "border border-input bg-transparent text-foreground hover:bg-accent-soft hover:border-border-hover"
      )}
    >
      {plan.cta}
    </Link>
  );
}

export function PricingSection() {
  const { isSignedIn } = useAuth();

  return (
    <section
      id={SECTION_PRICING}
      aria-labelledby="pricing-heading"
      className="scroll-mt-28 py-20 lg:py-28"
    >
      <div className="container mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="pricing-heading"
          heading={PRICING_CONTENT.heading}
          className="mb-12"
        />

        {/* Three plan cards */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 items-stretch mb-5">
          {PRICING_CONTENT.plans.map((plan) => {
            const isPro = plan.variant === "pro";
            const isExplorer = plan.variant === "explorer";

            return (
              <div
                key={plan.name}
                className={cn(
                  "relative flex flex-col gap-6 rounded-2xl border p-7",
                  isPro
                    ? "border-primary-border bg-card shadow-[0_0_40px_-8px_color-mix(in_oklab,var(--primary)_25%,transparent)] before:absolute before:inset-x-0 before:top-0 before:h-px before:rounded-t-2xl before:bg-gradient-to-r before:from-transparent before:via-primary/60 before:to-transparent"
                    : isExplorer
                    ? "border-border-hover/60 bg-card"
                    : "border-border bg-card"
                )}
              >
                {/* Badge (Pro only) */}
                {plan.badge && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                    {plan.badge}
                  </span>
                )}

                {/* Plan header */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.priceUnit && (
                    <span className="text-sm text-muted-foreground">
                      {plan.priceUnit}
                    </span>
                  )}
                </div>

                {/* Lead-in line (Pro) */}
                {plan.leadIn && (
                  <p className="text-xs font-medium text-muted-foreground -mb-2">
                    {plan.leadIn}
                  </p>
                )}

                {/* Feature list */}
                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-accent-foreground"
                      />
                      <span className="text-sm text-muted-foreground leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA pinned to bottom */}
                <PricingCta plan={plan} isSignedIn={isSignedIn} />
              </div>
            );
          })}
        </div>

        {/* Business strip */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: name + tagline + price */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-3">
                <h3 className="text-base font-semibold text-foreground">
                  {PRICING_CONTENT.business.name}
                </h3>
                <span className="text-2xl font-bold text-foreground">
                  {PRICING_CONTENT.business.price}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {PRICING_CONTENT.business.tagline}
              </p>
            </div>

            {/* Center: feature list inline */}
            <ul className="flex flex-wrap gap-x-6 gap-y-2 lg:flex-1 lg:justify-center">
              {PRICING_CONTENT.business.features.map((feature) => (
                <li key={feature} className="flex items-center gap-1.5">
                  <Check
                    aria-hidden
                    className="size-3.5 shrink-0 text-accent-foreground"
                  />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Right: CTA */}
            {CONTACT_SALES_HREF ? (
              <Link
                href={CONTACT_SALES_HREF}
                className={cn(
                  "flex h-11 shrink-0 items-center justify-center rounded-full px-6 text-sm font-medium font-[inherit] transition-all duration-150",
                  "border border-input bg-transparent text-foreground hover:bg-accent-soft hover:border-border-hover",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                {PRICING_CONTENT.business.cta}
              </Link>
            ) : (
              <button
                type="button"
                aria-disabled="true"
                title="Coming soon"
                className={cn(
                  "flex h-11 shrink-0 cursor-not-allowed items-center justify-center rounded-full px-6 text-sm font-medium font-[inherit] opacity-60",
                  "border border-input bg-transparent text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
                onClick={(e) => e.preventDefault()}
              >
                {PRICING_CONTENT.business.cta}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
