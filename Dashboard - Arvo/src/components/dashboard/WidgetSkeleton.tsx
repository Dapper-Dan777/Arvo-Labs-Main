import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface WidgetSkeletonProps {
  showHeader?: boolean;
  lines?: number;
  className?: string;
}

export function WidgetSkeleton({ showHeader = true, lines = 3, className }: WidgetSkeletonProps) {
  return (
    <Card className={className}>
      {showHeader && (
        <div className="px-4 py-3 border-b border-border/50">
          <Skeleton className="h-5 w-32" />
        </div>
      )}
      <div className="p-4 space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

