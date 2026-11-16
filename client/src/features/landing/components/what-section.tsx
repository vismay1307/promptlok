import { Library, Globe, Building2, type LucideIcon } from "lucide-react";
import { WHAT_CONTENT, type WhatPart } from "../content/landing-content";
import { SectionHeading } from "./section-heading";
import { SECTION_WHAT } from "../config/landing-config";

const ICON_MAP: Record<WhatPart["icon"], LucideIcon> = {
  Library,
  Globe,
  Building2,
};

export function WhatSection() {
  return (
    <section
      id={SECTION_WHAT}
      aria-labelledby="what-heading"
      className="scroll-mt-28 py-20 lg:py-28 border-y border-border-subtle bg-card/40"
    >
      <div className="container mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="what-heading"
          heading={
            <span
              className="tracking-tight leading-none [font-synthesis:none]"
              style={{ fontFamily: "var(--font-landing-display)" }}
            >
              <span className="text-foreground">What is </span>
              <span className="text-accent-foreground dark:bg-gradient-to-r dark:from-accent-foreground dark:to-primary dark:bg-clip-text dark:text-transparent">
                PromptLok?
              </span>
            </span>
          }
          headingClassName="text-4xl sm:text-5xl lg:text-6xl font-normal"
          className="mb-6"
        />

        {/* Body paragraph */}
        <p className="mx-auto mb-16 max-w-3xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
          {WHAT_CONTENT.paragraph}
        </p>

        {/* Three connected parts */}
        <div className="relative">
          {/* Desktop connector line (behind cards) */}
          <div
            aria-hidden
            className="absolute top-10 left-[calc(100%/6)] right-[calc(100%/6)] h-px bg-border hidden lg:block"
          />

          <div className="grid grid-cols-1 gap-0 lg:grid-cols-3">
            {WHAT_CONTENT.parts.map((part, i) => {
              const Icon = ICON_MAP[part.icon];
              const isLast = i === WHAT_CONTENT.parts.length - 1;

              return (
                <div key={part.title} className="relative flex flex-col items-center text-center">
                  {/* Mobile vertical connector */}
                  {!isLast && (
                    <div
                      aria-hidden
                      className="lg:hidden absolute left-1/2 -translate-x-1/2 top-full h-8 w-px bg-border z-0"
                      style={{ top: "calc(100% - 2rem)" }}
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 mx-2 mb-8 lg:mb-0 w-full">
                    {/* Desktop connector nodes */}
                    {i > 0 && (
                      <div
                        aria-hidden
                        className="hidden lg:block absolute -left-3 top-10 size-3 rounded-full bg-primary-border ring-4 ring-card -translate-y-1/2"
                      />
                    )}
                    {!isLast && (
                      <div
                        aria-hidden
                        className="hidden lg:block absolute -right-3 top-10 size-3 rounded-full bg-primary-border ring-4 ring-card -translate-y-1/2"
                      />
                    )}

                    {/* Icon tile */}
                    <div className="flex size-14 items-center justify-center rounded-2xl border border-border-subtle bg-accent-soft text-accent-foreground">
                      <Icon className="size-6" aria-hidden />
                    </div>

                    <h3 className="text-lg font-semibold text-foreground">
                      {part.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {part.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
