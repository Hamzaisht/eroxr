
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSection = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 sm:py-24">
      <div className="space-y-8">
        {/* Section header skeleton */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Skeleton className="h-8 w-64 bg-white/5" />
          <Skeleton className="h-4 w-full max-w-md bg-white/5" />
        </div>
        
        {/* Content skeleton - generic grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-4 p-4 rounded-xl border border-white/5 bg-white/2">
              <Skeleton className="h-40 w-full rounded-lg bg-white/5" />
              <Skeleton className="h-6 w-3/4 bg-white/5" />
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-2/3 bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSection;
