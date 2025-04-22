
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonCardsProps {
  count?: number;
  type?: 'grid' | 'list';
}

export const SkeletonCards = ({ count = 6, type = 'grid' }: SkeletonCardsProps) => {
  return (
    <div className={type === 'grid' 
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
      : "flex flex-col gap-4"
    }>
      {Array.from({ length: count }).map((_, i) => (
        type === 'grid' ? (
          <GridSkeleton key={i} />
        ) : (
          <ListSkeleton key={i} />
        )
      ))}
    </div>
  );
};

const GridSkeleton = () => (
  <div className="bg-luxury-dark/40 backdrop-blur-sm rounded-xl border border-luxury-primary/10 p-0 overflow-hidden">
    <Skeleton className="w-full h-48 bg-luxury-primary/5" />
    <div className="p-4 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-3/4 bg-luxury-primary/5" />
        <Skeleton className="h-6 w-6 rounded-full bg-luxury-primary/5" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-20 rounded-full bg-luxury-primary/5" />
        <Skeleton className="h-5 w-20 rounded-full bg-luxury-primary/5" />
      </div>
      <Skeleton className="h-4 w-full bg-luxury-primary/5" />
      <Skeleton className="h-4 w-3/4 bg-luxury-primary/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-4 w-16 rounded-full bg-luxury-primary/5" />
        <Skeleton className="h-4 w-16 rounded-full bg-luxury-primary/5" />
      </div>
    </div>
  </div>
);

const ListSkeleton = () => (
  <div className="flex bg-luxury-dark/40 backdrop-blur-sm rounded-xl border border-luxury-primary/10 overflow-hidden">
    <Skeleton className="w-48 h-32 bg-luxury-primary/5" />
    <div className="p-4 flex-1 space-y-2">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-1/2 bg-luxury-primary/5" />
        <Skeleton className="h-6 w-6 rounded-full bg-luxury-primary/5" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-4 w-20 rounded-full bg-luxury-primary/5" />
        <Skeleton className="h-4 w-16 rounded-full bg-luxury-primary/5" />
      </div>
      <Skeleton className="h-4 w-3/4 bg-luxury-primary/5" />
      <div className="flex justify-end gap-2">
        <Skeleton className="h-8 w-8 rounded-full bg-luxury-primary/5" />
        <Skeleton className="h-8 w-24 rounded-md bg-luxury-primary/5" />
      </div>
    </div>
  </div>
);
