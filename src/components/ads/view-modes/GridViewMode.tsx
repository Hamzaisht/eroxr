import { useState, useEffect, useRef } from "react";
import { DatingAd } from "../types/dating";
import { EnhancedAdCard } from "./components/grid-item/EnhancedAdCard";
import { FullscreenAdViewer } from "../video-profile/FullscreenAdViewer";
import { useIsMobile } from "@/hooks/use-mobile";
import { SkeletonCards } from "./SkeletonCards";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useSwipeGestures } from "@/hooks/useSwipeGestures";
import { useOptimizedScroll } from "@/hooks/useOptimizedScroll";
import { supabase } from "@/integrations/supabase/client";

interface GridViewModeProps {
  ads: DatingAd[];
  isLoading?: boolean;
  userProfile?: DatingAd | null;
  pageSize?: number;
}

export const GridViewMode = ({ 
  ads, 
  isLoading = false, 
  userProfile = null,
  pageSize = 12
}: GridViewModeProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedAd, setSelectedAd] = useState<DatingAd | null>(null);
  const isMobile = useIsMobile();
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Use optimized scroll instead of basic scroll handling
  const { scrollToTop } = useOptimizedScroll({
    threshold: 100,
    enablePullToRefresh: isMobile,
    onRefresh: () => {
      // Trigger refresh logic
      console.log('Refreshing grid...');
    }
  });
  
  const {
    data: visibleAds,
    setData: setVisibleAds,
    lastElementRef,
    loading: loadingMore,
    hasMore,
  } = useInfiniteScroll<DatingAd>({
    threshold: 400,
  });
  
  useEffect(() => {
    if (ads && ads.length) {
      setVisibleAds(ads.slice(0, pageSize));
    }
  }, [ads, pageSize, setVisibleAds]);
  
  useEffect(() => {
    if (!hasMore || loadingMore || !ads) return;
    
    const nextPageIndex = visibleAds.length;
    if (nextPageIndex >= ads.length) {
      return;
    }
    
    const nextItems = ads.slice(nextPageIndex, nextPageIndex + pageSize);
    if (nextItems.length > 0) {
      setVisibleAds(prev => [...prev, ...nextItems]);
    }
    
  }, [hasMore, loadingMore, ads, visibleAds.length, setVisibleAds, pageSize]);
  
  const handleSelectAd = (ad: DatingAd) => {
    setSelectedAd(ad);
    
    if (ad.id) {
      try {
        supabase.from('dating_ads').update({ 
          view_count: (ad.view_count || 0) + 1 
        }).eq('id', ad.id)
        .then(() => {
          console.log('View tracked');
        });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    }
  };
  
  // Use swipe gestures for better mobile experience
  const { ref: swipeRef } = useSwipeGestures({
    onSwipeDown: () => {
      if (window.scrollY === 0) {
        // Pull to refresh
        scrollToTop();
        console.log('Refreshing via swipe...');
      }
    },
    enabled: isMobile,
    threshold: 50
  });
  
  if (isLoading) {
    return <SkeletonCards count={6} type="grid" />;
  }
  
  if (!ads || ads.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 bg-black/20 rounded-xl">
        <p className="text-luxury-neutral">No profiles found matching your criteria</p>
      </div>
    );
  }
  
  return (
    <>
      <div 
        ref={(el) => {
          gridRef.current = el;
          if (swipeRef) {
            swipeRef.current = el;
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 touch-optimized gpu-accelerate"
        style={{ minHeight: '200px' }}
      >
        {visibleAds.map((ad, index) => {
          // Create a truly unique key combining id, index and a random component
          const uniqueKey = `${ad.id || 'no-id'}-${index}-${ad.created_at || 'no-date'}`;
          return (
            <div key={uniqueKey} ref={index === visibleAds.length - 4 ? lastElementRef : undefined}>
              <EnhancedAdCard 
                ad={ad}
                onSelect={handleSelectAd}
                isMobile={isMobile}
                userProfile={userProfile}
                index={index}
              />
            </div>
          );
        })}
      </div>
      
      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
        </div>
      )}
      
      {selectedAd && (
        <FullscreenAdViewer 
          ad={selectedAd} 
          onClose={() => setSelectedAd(null)} 
        />
      )}
    </>
  );
};
