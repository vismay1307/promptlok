
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import {
  appNavItems,
  isNavItemActive,
} from "@/components/layout/nav-config";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Open navigation"
          >
            <Menu />
          </Button>
        }
      />

      <SheetContent side="left" className="w-[280px] max-w-[85vw] p-0">
        <SheetHeader className="border-b border-sidebar-border px-6 py-5 text-left">
          <div className="flex items-center">
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

          <SheetTitle className="sr-only">PromptLok</SheetTitle>
          <SheetDescription className="sr-only">
            AI Prompt Workspace
          </SheetDescription>
        </SheetHeader>

        <nav
          aria-label="Mobile navigation"
          className="space-y-2 p-4"
        >
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>

          {appNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isNavItemActive(pathname, item);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm font-medium",
                  "transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
                  isActive
                    ? "border-sidebar-accent bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-foreground hover:bg-muted",
                ].join(" ")}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
