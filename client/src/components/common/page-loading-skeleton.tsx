import { Skeleton } from "@/components/ui/skeleton";

type PageLoadingSkeletonProps = {
  count?: number;
};

export function PageLoadingSkeleton({
  count = 6,
}: PageLoadingSkeletonProps) {
  const itemCount = Math.max(1, Math.min(count, 12));

  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading content">
      {/* Page header skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      {/* Content cards skeleton */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: itemCount }, (_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border border-border bg-card p-5"
          >
            <Skeleton className="h-5 w-2/3" />

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />

            <div className="flex gap-2 pt-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}