import type { ReactNode } from "react";
import { montserrat, bbhBogle } from "@/features/landing/fonts";
import { cn } from "cn";

type MarketingLayoutProps = {
  children: ReactNode;
};

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div
      className={cn(
        montserrat.variable,
        bbhBogle.variable,
        "font-[family-name:var(--font-landing-body)] overflow-x-clip"
      )}
    >
      {/* Skip to main content — first focusable element on page */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>
      {children}
    </div>
  );
}
