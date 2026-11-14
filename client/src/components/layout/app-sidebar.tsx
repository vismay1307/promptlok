
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  appNavItems,
  isNavItemActive,
} from "@/components/layout/nav-config";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
      {/* Brand */}
      <div className="flex h-20 items-center border-b border-sidebar-border px-6">
        <Image
          src="/logo/promptlok-logo-light.png"
          alt="PromptLok"
          width={949}
          height={195}
          priority
          className="h-9 w-auto object-contain dark:hidden"
        />

        <Image
          src="/logo/promptlok-logo-dark.png"
          alt="PromptLok"
          width={946}
          height={198}
          priority
          className="hidden h-9 w-auto object-contain dark:block"
        />
      </div>

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-6 px-4 py-7"
      >
        <div className="space-y-2">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>

          {appNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(pathname, item);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                ].join(" ")}
              >
                <Icon size={19} strokeWidth={1.9} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-5">
        <div className="rounded-xl bg-sidebar-accent p-4">
          <p className="text-sm font-semibold">
            Your ideas, organized.
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Keep your AI prompts organized in one place.
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          PromptLok · MVP
        </p>
      </div>
    </aside>
  );
}
