/**
 * landing-content.ts
 * All copy, nav items, feature cards, product parts, plans, and sample preview data.
 * Edit copy here only — never inline in components.
 */

import {
  SECTION_WHY,
  SECTION_WHAT,
  SECTION_PRICING,
} from "../config/landing-config";

// ─── Navbar ──────────────────────────────────────────────────────────────────

export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Why PromptLok", href: `#${SECTION_WHY}` },
  { label: "What is PromptLok", href: `#${SECTION_WHAT}` },
  { label: "Pricing", href: `#${SECTION_PRICING}` },
];

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const HERO_CONTENT = {
  brand: "PromptLok.",
  tagline: "Discover · Organize · Share",
  h1Line1: "PROMPT IS THE",
  h1Line2: "NEW SPEC.",
  supporting: "Stop losing great prompts.",
  description:
    "Save, organize, version, and discover AI prompts in one place. Build your personal library, learn from the community, and share trusted prompts with your team.",
  primaryCta: "Explore Prompts",
  secondaryCta: "Create Your Library",
} as const;

// ─── Why Section ─────────────────────────────────────────────────────────────

export type WhyCard = {
  icon: "Library" | "History" | "Compass" | "Users";
  title: string;
  body: string;
};

export const WHY_CONTENT = {
  heading: "Why PromptLok?",
  supporting:
    "Your best prompts deserve more than scattered notes and forgotten documents.",
  cards: [
    {
      icon: "Library",
      title: "Everything in One Place",
      body: "Keep your prompts organized in a structured personal library instead of losing them across different apps, documents and chats.",
    },
    {
      icon: "History",
      title: "Never Lose a Version",
      body: "Maintain prompt versions and track improvements. Keep a history of how your prompts evolve.",
    },
    {
      icon: "Compass",
      title: "Discover What Works",
      body: "Explore prompts shared by the community, learn from other users and discover useful approaches.",
    },
    {
      icon: "Users",
      title: "Built for Teams",
      body: "Give teams a shared place to organize prompts, collaborate and maintain trusted internal prompt libraries.",
    },
  ] satisfies WhyCard[],
} as const;

// ─── What Section ─────────────────────────────────────────────────────────────

export type WhatPart = {
  icon: "Library" | "Globe" | "Building2";
  title: string;
  description: string;
};

export const WHAT_CONTENT = {
  heading: "What is PromptLok?",
  paragraph:
    "PromptLok is a collaborative platform for managing AI prompts. It gives individuals a personal library to create, organize and version their prompts, a global community to discover and share useful prompts, and teams a private workspace to manage trusted prompt knowledge together.",
  parts: [
    {
      icon: "Library",
      title: "Personal Library",
      description:
        "Create, save, organize and version your own prompts.",
    },
    {
      icon: "Globe",
      title: "Global Community",
      description:
        "Discover, share, discuss and learn from prompts created by others.",
    },
    {
      icon: "Building2",
      title: "Team Workspace",
      description:
        "Organize private team prompts, collaborate and maintain trusted versions.",
    },
  ] satisfies WhatPart[],
} as const;

// ─── Pricing ──────────────────────────────────────────────────────────────────

export type PricingFeature = string;

export type PricingPlan = {
  name: string;
  tagline: string;
  price: string;
  priceUnit?: string;
  badge?: string;
  leadIn?: string;
  features: PricingFeature[];
  cta: string;
  variant: "free" | "explorer" | "pro";
};

export type BusinessPlan = {
  name: string;
  tagline: string;
  price: string;
  features: PricingFeature[];
  cta: string;
};

export const PRICING_CONTENT = {
  heading: "Simple plans. Room to grow.",
  plans: [
    {
      name: "Free",
      tagline: "Experience the product",
      price: "$0",
      features: [
        "7-day free trial, starting when you create your account",
        "3 prompt posts and 5 prompt requests during the trial",
        "Save prompts during the trial (7-day storage)",
        "Trial content is archived, never silently deleted",
      ],
      cta: "Start free trial",
      variant: "free",
    },
    {
      name: "Explorer",
      tagline: "Discover & participate",
      price: "$3",
      priceUnit: "/month",
      features: [
        "Global community access",
        "Prompt discovery and search",
        "Prompt posting and prompt requests, with reasonable monthly limits",
        "Voting and comments",
        "Save prompts with basic collections",
        "Basic version history",
        "Public profile",
      ],
      cta: "Get started",
      variant: "explorer",
    },
    {
      name: "Pro",
      tagline: "Build & manage your system",
      price: "$6",
      priceUnit: "/month",
      badge: "Premium",
      leadIn: "Everything in Explorer, plus:",
      features: [
        "Unlimited private prompt vault",
        "Permanent prompt storage",
        "Full version history, comparison & restore",
        "Forking and remixing",
        "Variables and templates",
        "Advanced collections",
        "Personal analytics",
        "Full data export",
      ],
      cta: "Get started",
      variant: "pro",
    },
  ] satisfies PricingPlan[],
  business: {
    name: "Business",
    tagline: "Govern org-wide AI knowledge",
    price: "Custom",
    features: [
      "Private organization workspace",
      "Departments, roles and Prompt Leaders",
      "Approval workflow and Official prompts",
      "Audit log and analytics",
    ],
    cta: "Contact Sales",
  } satisfies BusinessPlan,
} as const;

// ─── Product Preview Sample Data ──────────────────────────────────────────────
// ILLUSTRATIVE SAMPLE DATA — not real user content; purely decorative.

export type PreviewPromptCard = {
  status: string;
  type: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  model: string;
};

export const PREVIEW_PROMPTS: PreviewPromptCard[] = [
  {
    status: "Draft",
    type: "TEXT",
    title: "SaaS Value Proposition & Go-To-Market Strategy",
    description:
      "Craft a compelling value proposition and outline a go-to-market strategy for a B2B SaaS product.",
    category: "Business",
    tags: ["saas", "gtm", "strategy"],
    model: "Claude",
  },
  {
    status: "Draft",
    type: "TEXT",
    title: "Optimized Data Table with TanStack Table",
    description:
      "Generate a performant, fully typed data table component using TanStack Table with sorting and filtering.",
    category: "Coding & Development",
    tags: ["react", "nextjs", "tables"],
    model: "GPT-4o",
  },
  {
    status: "Draft",
    type: "TEXT",
    title: "Customer Support Response Assistant",
    description:
      "Write empathetic, on-brand customer support replies that resolve issues and retain goodwill.",
    category: "Marketing",
    tags: ["support", "tone"],
    model: "Claude",
  },
];

export const PREVIEW_VERSION_HISTORY = {
  promptTitle: "Customer Support Reply",
  versions: [
    { label: "v3 · Under 100 words", isCurrent: true },
    { label: "v2 · Concise and empathetic", isCurrent: false },
    { label: "v1 · Professional reply", isCurrent: false },
  ],
} as const;

export const PREVIEW_COMMUNITY = {
  label: "Community",
  items: [
    { title: "Refund policy response", tag: "#support" },
    { title: "Ad copy generator", tag: "#marketing" },
  ],
} as const;

export const PREVIEW_SIDEBAR_ITEMS = [
  { label: "Dashboard", active: false },
  { label: "My Prompts", active: true },
  { label: "Create Prompt", active: false },
  { label: "Settings", active: false },
] as const;
