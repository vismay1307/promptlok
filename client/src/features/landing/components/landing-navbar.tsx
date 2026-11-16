"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { BrandLogo } from "./brand-logo";
import { NAV_LINKS } from "../content/landing-content";
import { scrollToSection } from "../lib/scroll-to-section";
import {
  SIGN_UP_HREF,
  DASHBOARD_HREF,
  SECTION_WHY,
  SECTION_WHAT,
  SECTION_PRICING,
} from "../config/landing-config";
import { cn } from "cn";

const SECTION_IDS: Record<string, string> = {
  [`#${SECTION_WHY}`]: SECTION_WHY,
  [`#${SECTION_WHAT}`]: SECTION_WHAT,
  [`#${SECTION_PRICING}`]: SECTION_PRICING,
};

export function LandingNavbar() {
  const { isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Strengthen capsule on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Close menu on hash change
  useEffect(() => {
    const onHashChange = () => setMenuOpen(false);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    const id = SECTION_IDS[href];
    if (id) {
      scrollToSection(e, id);
      setMenuOpen(false);
    }
  }

  const ctaLabel = isSignedIn ? "Open Dashboard" : "Get Started";
  const ctaHref = isSignedIn ? DASHBOARD_HREF : SIGN_UP_HREF;

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Capsule */}
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-full border border-border px-4 py-2 transition-all duration-200",
            scrolled
              ? "bg-background/90 shadow-lg backdrop-blur-xl"
              : "bg-background/70 shadow-sm backdrop-blur-xl"
          )}
          style={{ WebkitBackdropFilter: "blur(16px)" }}
        >
          {/* Left: Logo */}
          <BrandLogo height={28} />

          {/* Center: Nav links (desktop) */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-accent-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Theme toggle + CTA */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* CTA — min-width so label swap causes no layout shift */}
            <Link
              href={ctaHref}
              className={cn(
                "inline-flex h-9 min-w-[9rem] items-center justify-center rounded-full px-5 text-sm font-medium font-[inherit] transition-all duration-150",
                "bg-primary text-primary-foreground border border-primary-border hover:bg-primary-hover active:bg-primary-active",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
            >
              {ctaLabel}
            </Link>

            {/* Mobile menu trigger */}
            <button
              ref={triggerRef}
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden inline-flex size-9 items-center justify-center rounded-full border border-border bg-transparent text-muted-foreground transition-colors hover:bg-accent-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {menuOpen ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown panel */}
        {menuOpen && (
          <div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-label="Navigation menu"
            className="md:hidden mt-2 rounded-3xl border border-border bg-background/90 backdrop-blur-xl p-4 shadow-xl"
            style={{ WebkitBackdropFilter: "blur(16px)" }}
          >
            <nav aria-label="Mobile primary" className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 pt-2 border-t border-border">
                <Link
                  href={ctaHref}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex h-11 w-full items-center justify-center rounded-full text-sm font-medium font-[inherit] transition-all duration-150",
                    "bg-primary text-primary-foreground border border-primary-border hover:bg-primary-hover active:bg-primary-active",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  {ctaLabel}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
