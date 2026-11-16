import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  /** px height of the displayed logo; width is automatic (w-auto) */
  height?: number;
  className?: string;
};

/**
 * BrandLogo — renders both light and dark logo images and swaps via CSS.
 * Fixed height so theme toggle never causes layout shift.
 */
export function BrandLogo({ height = 28, className }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="PromptLok — go to homepage"
      className={`inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm ${className ?? ""}`}
    >
      {/* Light theme logo (dark text, shown in light mode) */}
      <Image
        src="/logo/promptlok-logo-light.png"
        alt="PromptLok"
        width={949}
        height={195}
        style={{ height, width: "auto" }}
        className="block dark:hidden"
        priority
      />
      {/* Dark theme logo (light text, shown in dark mode) */}
      <Image
        src="/logo/promptlok-logo-dark.png"
        alt="PromptLok"
        width={946}
        height={198}
        style={{ height, width: "auto" }}
        className="hidden dark:block"
        priority
      />
    </Link>
  );
}
