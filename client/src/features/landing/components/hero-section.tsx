import { HERO_CONTENT } from "../content/landing-content";
import { HeroCtas } from "./auth-cta";
import { ProductPreview } from "./product-preview";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-x-clip pt-32 pb-20 lg:pt-40 lg:pb-28"
    >
      {/* Background glow — decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Top-right golden glow */}
        <div className="absolute -top-32 right-0 h-[600px] w-[600px] rounded-full bg-primary/15 blur-3xl opacity-50 dark:opacity-30" />
        {/* Faint dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-foreground) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="container relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* ── Left column ──────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Eyebrow row */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground">
                {HERO_CONTENT.brand}
              </span>
              <span
                className="h-4 w-px bg-border"
                aria-hidden
              />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent-foreground">
                {HERO_CONTENT.tagline}
              </span>
            </div>

            {/* H1 — BBH Bogle display font */}
            <h1
              id="hero-heading"
              className="flex flex-col gap-0 tracking-tight leading-[0.92] [font-synthesis:none]"
              style={{ fontFamily: "var(--font-landing-display)" }}
            >
              <span
                className="block text-foreground"
                style={{
                  fontSize: "clamp(3rem, 9.5vw, 7.5rem)",
                }}
              >
                {HERO_CONTENT.h1Line1}
              </span>
              <span
                className="block text-accent-foreground dark:bg-gradient-to-r dark:from-accent-foreground dark:to-primary dark:bg-clip-text dark:text-transparent"
                style={{
                  fontSize: "clamp(3rem, 9.5vw, 7.5rem)",
                }}
              >
                {HERO_CONTENT.h1Line2}
              </span>
            </h1>

            {/* Supporting headline */}
            <p className="text-xl font-semibold text-foreground sm:text-2xl">
              {HERO_CONTENT.supporting}
            </p>

            {/* Description */}
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {HERO_CONTENT.description}
            </p>

            {/* CTAs — client component (auth-aware) */}
            <HeroCtas />
          </div>

          {/* ── Right column: Product Preview ──────── */}
          <div className="relative mt-8 lg:mt-0 px-6 sm:px-8 lg:px-0">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
}


