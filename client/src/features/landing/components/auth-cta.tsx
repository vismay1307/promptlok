"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";

import {
  SIGN_UP_HREF,
  VAULT_HREF,
  EXPLORE_PROMPTS_SIGNED_IN_HREF,
  EXPLORE_PROMPTS_SIGNED_OUT_HREF,
} from "../config/landing-config";
import { HERO_CONTENT } from "../content/landing-content";

export function HeroCtas() {
  const { isSignedIn } = useAuth();

  const exploreHref = isSignedIn
    ? EXPLORE_PROMPTS_SIGNED_IN_HREF
    : EXPLORE_PROMPTS_SIGNED_OUT_HREF;

  const libraryHref = isSignedIn ? VAULT_HREF : SIGN_UP_HREF;

  return (
    <div className="flex flex-wrap gap-3">
      {/* Primary CTA */}
      <Link
        href={exploreHref}
        className={cn(
          "group inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium font-[inherit] transition-all duration-150",
          "bg-primary text-primary-foreground border border-primary-border hover:bg-primary-hover active:bg-primary-active",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        {HERO_CONTENT.primaryCta}
        <ArrowRight
          aria-hidden
          className="size-4 motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-0.5"
        />
      </Link>

      {/* Secondary CTA */}
      <Link
        href={libraryHref}
        className={cn(
          "inline-flex h-12 items-center rounded-full px-6 text-sm font-medium font-[inherit] transition-all duration-150",
          "border border-input bg-transparent text-foreground hover:bg-accent-soft hover:border-border-hover",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        {HERO_CONTENT.secondaryCta}
      </Link>
    </div>
  );
}
