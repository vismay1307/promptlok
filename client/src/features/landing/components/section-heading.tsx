import type { ReactNode } from "react";
import { cn } from "cn";

type SectionHeadingProps = {
  id: string;
  heading: ReactNode;
  supporting?: string;
  className?: string;
  headingClassName?: string;
};

export function SectionHeading({
  id,
  heading,
  supporting,
  className,
  headingClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn("text-center", className)}>
      <h2
        id={id}
        className={cn(
          "text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
          headingClassName
        )}
      >
        {heading}
      </h2>
      {supporting && (
        <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {supporting}
        </p>
      )}
    </div>
  );
}
