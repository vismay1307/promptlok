import { Library, History, Compass, Users, type LucideIcon } from "lucide-react";
import { WHY_CONTENT, type WhyCard } from "../content/landing-content";
import { SectionHeading } from "./section-heading";
import { SECTION_WHY } from "../config/landing-config";

const ICON_MAP: Record<WhyCard["icon"], LucideIcon> = {
  Library,
  History,
  Compass,
  Users,
};

export function WhySection() {
  return (
    <section
      id={SECTION_WHY}
      aria-labelledby="why-heading"
      className="scroll-mt-28 py-20 lg:py-28"
    >
      <div className="container mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="why-heading"
          heading={
            <span
              className="tracking-tight leading-none [font-synthesis:none]"
              style={{ fontFamily: "var(--font-landing-display)" }}
            >
              <span className="text-foreground">Why </span>
              <span className="text-accent-foreground dark:bg-gradient-to-r dark:from-accent-foreground dark:to-primary dark:bg-clip-text dark:text-transparent">
                PromptLok?
              </span>
            </span>
          }
          headingClassName="text-4xl sm:text-5xl lg:text-6xl font-normal"
          supporting={WHY_CONTENT.supporting}
          className="mb-12"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {WHY_CONTENT.cards.map((card) => {
            const Icon = ICON_MAP[card.icon];
            return (
              <div
                key={card.title}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-150 motion-safe:hover:-translate-y-0.5 hover:border-border-hover hover:shadow-[0_4px_24px_-4px_color-mix(in_oklab,var(--primary)_20%,transparent)]"
              >
                {/* Icon tile */}
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-accent-soft text-accent-foreground">
                  <Icon className="size-5" aria-hidden />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-foreground leading-snug">
                  {card.title}
                </h3>

                {/* Body */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
