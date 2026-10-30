import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <section className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      {icon && (
        <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground [&_svg]:size-7">
          {icon}
        </div>
      )}

      <h2 className="text-lg font-semibold tracking-tight">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </section>
  );
}