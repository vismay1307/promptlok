/**
 * landing-config.ts
 * Single source of truth for all link targets used on the landing page.
 * Update here when routes change; nothing else needs editing.
 */

// Auth routes (verified in src/app/sign-in and src/app/sign-up)
export const SIGN_IN_HREF = "/sign-in" as const;
export const SIGN_UP_HREF = "/sign-up" as const;

// Authenticated app routes (verified in src/app/(app))
export const DASHBOARD_HREF = "/dashboard" as const;
export const VAULT_HREF = "/vault" as const;

// In-page section ids
export const SECTION_WHY = "why-promptlok" as const;
export const SECTION_WHAT = "what-is-promptlok" as const;
export const SECTION_PRICING = "pricing" as const;

// Contact Sales — no route or email exists yet.
// While undefined, the button renders aria-disabled with title "Coming soon".
// TODO: set this to "mailto:sales@promptlok.com" or "/contact" once available.
export const CONTACT_SALES_HREF: string | undefined = undefined;

// TODO: "Explore Prompts" — no /explore route exists yet.
// Current behavior: signed-out → SIGN_UP_HREF, signed-in → VAULT_HREF.
// Update to "/explore" once that route is built.
export const EXPLORE_PROMPTS_SIGNED_OUT_HREF = SIGN_UP_HREF;
export const EXPLORE_PROMPTS_SIGNED_IN_HREF = VAULT_HREF;
