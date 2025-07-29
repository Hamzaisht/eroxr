import { ReactNode, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useOptimizedScroll } from '@/hooks/useOptimizedScroll';
import { cn } from '@/lib/utils';
import { Loader2, RotateCcw } from 'lucide-react';

interface OptimizedScrollContainerProps {
  children: ReactNode;
  className?: string;
  onScrollEnd?: () => void;
  onRefresh?: () => void;
  enablePullToRefresh?: boolean;
  isLoading?: boolean;
  hasMore?: boolean;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  threshold?: number;
}

export const OptimizedScrollContainer = forwardRef<HTMLDivElement, OptimizedScrollContainerProps>(
  ({
    children,
    className,
    onScrollEnd,
    onRefresh,
    enablePullToRefresh = false,
    isLoading = false,
    hasMore = true,
    loadingComponent,
    emptyComponent,
    threshold = 100
  }, externalRef) => {
    const {
      ref: scrollRef,
      isScrolling,
      isPullingToRefresh,
      scrollPosition,
      scrollToTop
    } = useOptimizedScroll({
      threshold,
      onScrollEnd: hasMore ? onScrollEnd : undefined,
      onRefresh,
      enablePullToRefresh
    });

    // Combine refs if external ref is provided
    const setRefs = (element: HTMLDivElement | null) => {
      scrollRef.current = element;
      if (typeof externalRef === 'function') {
        externalRef(element);
      } else if (externalRef) {
        externalRef.current = element;
      }
    };

    const DefaultLoadingComponent = () => (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-luxury-primary" />
        <span className="ml-2 text-luxury-muted">Loading more...</span>
      </div>
    );

    const PullToRefreshIndicator = () => (
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-luxury-primary/10 backdrop-blur-sm"
        initial={{ y: -60, opacity: 0 }}
        animate={{ 
          y: isPullingToRefresh ? 0 : -60,
          opacity: isPullingToRefresh ? 1 : 0 
        }}
        transition={{ type: 'spring', damping: 20 }}
      >
        <RotateCcw className={cn(
          "h-5 w-5 text-luxury-primary mr-2",
          isPullingToRefresh && "animate-spin"
        )} />
        <span className="text-luxury-neutral font-medium">
          {isPullingToRefresh ? 'Release to refresh' : 'Pull to refresh'}
        </span>
      </motion.div>
    );

    const ScrollToTopButton = () => (
      <motion.button
        className="fixed bottom-20 right-4 z-30 bg-luxury-primary/90 backdrop-blur-sm text-white p-3 rounded-full shadow-lg touch-target"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: scrollPosition > 300 ? 1 : 0,
          opacity: scrollPosition > 300 ? 1 : 0
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => scrollToTop()}
        aria-label="Scroll to top"
      >
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          ↑
        </motion.div>
      </motion.button>
    );

    return (
      <>
        <div
          ref={setRefs}
          className={cn(
            'relative overflow-y-auto smooth-mobile-scroll',
            'scrollbar-thin scrollbar-track-luxury-darker scrollbar-thumb-luxury-primary/30',
            isScrolling && 'scrolling',
            className
          )}
          style={{
            height: '100%',
            maxHeight: '100vh',
            scrollBehavior: 'smooth'
          }}
        >
          {/* Pull to refresh indicator */}
          {enablePullToRefresh && <PullToRefreshIndicator />}
          
          {/* Main content */}
          <div className={cn(
            'relative',
            isPullingToRefresh && 'transform-gpu transition-transform duration-300'
          )}>
            {children}
            
            {/* Loading indicator at bottom */}
            {isLoading && hasMore && (
              <div className="py-4">
                {loadingComponent || <DefaultLoadingComponent />}
              </div>
            )}
            
            {/* Empty state */}
            {!isLoading && !children && emptyComponent}
            
            {/* End of content indicator */}
            {!hasMore && !isLoading && (
              <div className="text-center py-6 text-luxury-muted">
                <div className="w-12 h-px bg-luxury-primary/20 mx-auto mb-2" />
                <span className="text-sm">You've reached the end</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Scroll to top button */}
        <ScrollToTopButton />
      </>
    );
  }
);

OptimizedScrollContainer.displayName = 'OptimizedScrollContainer';