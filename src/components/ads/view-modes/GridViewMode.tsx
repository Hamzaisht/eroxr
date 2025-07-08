import { useState, useEffect, useRef } from "react";
import { DatingAd } from "../types/dating";
import { GridItem } from "./components/GridItem";
import { FullscreenAdViewer } from "../video-profile/FullscreenAdViewer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SkeletonCards } from "./SkeletonCards";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const gridRef = useRef<HTMLDivElement>(null);
  
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
  
  useEffect(() => {
    if (!isMobile || !gridRef.current) return;
    
    let startY = 0;
    let isRefreshing = false;
    
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      
      if (diff > 70 && window.scrollY === 0 && !isRefreshing) {
        isRefreshing = true;
        
        if (gridRef.current) {
          gridRef.current.style.transform = `translateY(60px)`;
          gridRef.current.style.transition = 'transform 0.3s ease';
        }
        
        setTimeout(() => {
          if (gridRef.current) {
            gridRef.current.style.transform = '';
          }
          
          isRefreshing = false;
        }, 1000);
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile]);
  
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
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        style={{ minHeight: '200px' }}
      >
        {visibleAds.map((ad, index) => {
          // Create a unique key that doesn't conflict
          const uniqueKey = ad.id || `temp-ad-${index}-${Date.now()}`;
          return (
            <div key={uniqueKey} ref={index === visibleAds.length - 4 ? lastElementRef : undefined}>
              <GridItem 
                ad={ad}
                isHovered={hoveredId === ad.id}
                onHover={setHoveredId}
                onSelect={handleSelectAd}
                isMobile={isMobile}
                userProfile={userProfile}
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
