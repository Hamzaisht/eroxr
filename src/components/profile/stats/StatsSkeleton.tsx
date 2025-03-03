
import { Skeleton } from "@/components/ui/skeleton";

export const StatSkeleton = () => (
  <div className="neo-blur rounded-2xl p-4 flex items-center gap-3 bg-luxury-darker/60 backdrop-blur-lg">
    <Skeleton className="h-5 w-5 rounded-full" />
    <div className="flex flex-col gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-4 w-12" />
    </div>
  </div>
);
