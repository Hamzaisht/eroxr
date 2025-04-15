
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FullscreenAdViewer } from "../video-profile/FullscreenAdViewer";
import { LoadingGrid } from "./components/LoadingGrid";
import { GridItem } from "./components/GridItem";
import type { GridViewModeProps } from "./types";

export const GridViewMode = ({ ads, isLoading = false, onMediaClick }: GridViewModeProps) => {
  const [selectedAd, setSelectedAd] = useState<DatingAd | null>(null);
  const [hoveredAdId, setHoveredAdId] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  if (isLoading) {
    return <LoadingGrid />;
  }

  if (!ads || ads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-luxury-neutral">No ads found matching your criteria</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ads.map((ad) => (
          <GridItem
            key={ad.id}
            ad={ad}
            isHovered={hoveredAdId === ad.id}
            onHover={setHoveredAdId}
            onSelect={setSelectedAd}
            onMediaClick={onMediaClick}
            onTagClick={(tag, e) => {
              e.stopPropagation();
              if (ad.onTagClick) {
                ad.onTagClick(tag);
              }
            }}
            isMobile={isMobile}
          />
        ))}
      </div>
      
      <AnimatePresence>
        {selectedAd && (
          <FullscreenAdViewer 
            ad={selectedAd} 
            onClose={() => setSelectedAd(null)} 
          />
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
};
