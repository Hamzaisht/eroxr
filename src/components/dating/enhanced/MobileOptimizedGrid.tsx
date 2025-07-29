import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DatingAd } from '@/types/dating';
import { OptimizedScrollContainer } from './OptimizedScrollContainer';
import { SwipeController } from './SwipeController';
import { EnhancedAdCard } from '@/components/ads/view-modes/components/grid-item/EnhancedAdCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileOptimizedGridProps {
  ads: DatingAd[];
  isLoading?: boolean;
  hasMore?: boolean;
  userProfile?: DatingAd | null;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onAdSelect?: (ad: DatingAd) => void;
  className?: string;
}

export const MobileOptimizedGrid = memo(({
  ads,
  isLoading = false,
  hasMore = true,
  userProfile,
  onLoadMore,
  onRefresh,
  onAdSelect,
  className
}: MobileOptimizedGridProps) => {
  const isMobile = useIsMobile();

  // Memoize grid layout based on screen size
  const gridConfig = useMemo(() => {
    if (isMobile) {
      return {
        columns: 'grid-cols-1',
        gap: 'gap-4',
        padding: 'p-4'
      };
    }
    
    return {
      columns: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      gap: 'gap-6',
      padding: 'p-6'
    };
  }, [isMobile]);

  // Memoize animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 300
      }
    }
  }), []);

  // Handle card interactions
  const handleCardSelect = (ad: DatingAd) => {
    onAdSelect?.(ad);
  };

  const handleSwipeLeft = () => {
    // Could implement quick reject functionality
    console.log('Swiped left');
  };

  const handleSwipeRight = () => {
    // Could implement quick like functionality  
    console.log('Swiped right');
  };

  const EmptyState = () => (
    <motion.div 
      className="flex flex-col items-center justify-center py-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-16 h-16 bg-luxury-primary/10 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">💫</span>
      </div>
      <h3 className="text-xl font-semibold text-luxury-neutral mb-2">
        No profiles found
      </h3>
      <p className="text-luxury-muted max-w-sm">
        Try adjusting your filters or check back later for new connections.
      </p>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <div className={cn('grid', gridConfig.columns, gridConfig.gap)}>
      {Array.from({ length: isMobile ? 3 : 8 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="bg-luxury-darker/50 rounded-xl h-64 animate-pulse"
        />
      ))}
    </div>
  );

  if (isLoading && ads.length === 0) {
    return (
      <div className={cn(gridConfig.padding, className)}>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!isLoading && ads.length === 0) {
    return (
      <div className={cn(gridConfig.padding, className)}>
        <EmptyState />
      </div>
    );
  }

  return (
    <OptimizedScrollContainer
      className={cn('h-full', className)}
      onScrollEnd={onLoadMore}
      onRefresh={onRefresh}
      enablePullToRefresh={true}
      isLoading={isLoading}
      hasMore={hasMore}
    >
      <motion.div
        className={cn(
          'grid',
          gridConfig.columns,
          gridConfig.gap,
          gridConfig.padding,
          'min-h-full'
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {ads.map((ad, index) => (
          <motion.div
            key={`${ad.id}-${index}`}
            variants={itemVariants}
            layout
          >
            <SwipeController
              onSwipeLeft={isMobile ? handleSwipeLeft : undefined}
              onSwipeRight={isMobile ? handleSwipeRight : undefined}
              enabled={isMobile}
              className="h-full"
            >
              <EnhancedAdCard
                ad={ad}
                onSelect={handleCardSelect}
                isMobile={isMobile}
                userProfile={userProfile}
                index={index}
              />
            </SwipeController>
          </motion.div>
        ))}
      </motion.div>
    </OptimizedScrollContainer>
  );
});

MobileOptimizedGrid.displayName = 'MobileOptimizedGrid';