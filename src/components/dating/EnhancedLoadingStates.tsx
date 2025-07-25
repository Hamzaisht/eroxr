import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingProps {
  count?: number;
  type?: 'grid' | 'list' | 'card';
}

export function DatingSkeletonLoader({ count = 6, type = 'grid' }: LoadingProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {items.map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="dating-glass-panel rounded-xl p-4"
          >
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full dating-skeleton" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3 dating-skeleton" />
                <Skeleton className="h-3 w-1/2 dating-skeleton" />
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-16 rounded-full dating-skeleton" />
                  <Skeleton className="h-6 w-20 rounded-full dating-skeleton" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-8 rounded-full dating-skeleton" />
                <Skeleton className="h-8 w-8 rounded-full dating-skeleton" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="dating-glass-panel rounded-xl overflow-hidden"
        >
          <Skeleton className="h-48 w-full dating-skeleton" />
          <div className="p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-full dating-skeleton" />
              <Skeleton className="h-4 w-1/3 dating-skeleton" />
            </div>
            <Skeleton className="h-3 w-full dating-skeleton" />
            <Skeleton className="h-3 w-2/3 dating-skeleton" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-16 rounded-full dating-skeleton" />
              <Skeleton className="h-6 w-20 rounded-full dating-skeleton" />
              <Skeleton className="h-6 w-14 rounded-full dating-skeleton" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function DatingFiltersSkeleton() {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="dating-glass-panel rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-lg dating-skeleton" />
            <div>
              <Skeleton className="h-4 w-24 dating-skeleton" />
              <Skeleton className="h-3 w-32 mt-1 dating-skeleton" />
            </div>
          </div>
          <Skeleton className="h-6 w-6 dating-skeleton" />
        </div>
        
        <div className="space-y-4">
          <div>
            <Skeleton className="h-3 w-16 mb-2 dating-skeleton" />
            <Skeleton className="h-10 w-full rounded-lg dating-skeleton" />
          </div>
          <div>
            <Skeleton className="h-3 w-20 mb-2 dating-skeleton" />
            <Skeleton className="h-6 w-full dating-skeleton" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-16 rounded-full dating-skeleton" />
            <Skeleton className="h-8 w-20 rounded-full dating-skeleton" />
            <Skeleton className="h-8 w-18 rounded-full dating-skeleton" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function DatingHeaderSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dating-glass-panel rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2 dating-skeleton" />
          <Skeleton className="h-4 w-36 dating-skeleton" />
        </div>
        <div className="flex space-x-3">
          <Skeleton className="h-10 w-10 rounded-lg dating-skeleton" />
          <Skeleton className="h-10 w-10 rounded-lg dating-skeleton" />
          <Skeleton className="h-10 w-32 rounded-xl dating-skeleton" />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-24 rounded-xl dating-skeleton" />
          ))}
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-lg dating-skeleton" />
          <Skeleton className="h-8 w-8 rounded-lg dating-skeleton" />
        </div>
      </div>
    </motion.div>
  );
}