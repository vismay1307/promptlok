"use client";

import { usePathname } from "next/navigation";

import {
  appNavItems,
  isNavItemActive,
} from "@/components/layout/nav-config";import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function Topbar() {
  const pathname = usePathname();

const currentItem = appNavItems.find((item) =>
  isNavItemActive(pathname, item),
);
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <MobileNav />
        </div>

        <div>
          <p className="text-sm font-semibold">
            {currentItem?.label ?? "PromptLok"}
          </p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            AI Prompt Workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}