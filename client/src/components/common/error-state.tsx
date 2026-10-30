import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-destructive/30 bg-card px-6 py-10 text-center"
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertCircle size={24} />
      </div>

      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="mt-6"
        >
          {retryLabel}
        </Button>
      )}
    </section>
  );
}