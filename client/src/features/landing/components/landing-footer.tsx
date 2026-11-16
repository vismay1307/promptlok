import { BrandLogo } from "./brand-logo";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle py-10">
      <div className="container mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <BrandLogo height={24} />
          <p className="text-sm text-muted-foreground">
            © {year} PromptLok
          </p>
        </div>
      </div>
    </footer>
  );
}
