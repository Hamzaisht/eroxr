
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DatingAd } from "../types/dating";
import { FullscreenAdViewer } from "../video-profile/FullscreenAdViewer";
import { LoadingGrid } from "./components/LoadingGrid";
import { AdCard } from "./components/grid-item/AdCard";

interface GridViewModeProps {
  ads: DatingAd[];
  isLoading?: boolean;
  onMediaClick?: (ad: DatingAd) => void;
}

export const GridViewMode = ({ ads, isLoading = false, onMediaClick }: GridViewModeProps) => {
  const [selectedAd, setSelectedAd] = useState<DatingAd | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  if (isLoading) {
    return <LoadingGrid />;
  }

  if (!ads || ads.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[300px] rounded-xl bg-luxury-dark/40 backdrop-blur-sm p-8"
      >
        <p className="text-luxury-neutral text-lg">No profiles match your criteria</p>
      </motion.div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {ads.map((ad) => (
            <AdCard
              key={ad.id}
              ad={ad}
              onSelect={setSelectedAd}
              isMobile={isMobile}
            />
          ))}
        </AnimatePresence>
      </motion.div>
      
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
