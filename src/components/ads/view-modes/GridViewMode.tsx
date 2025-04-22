
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DatingAd } from "../types/dating";
import { AdCard } from "./components/grid-item";
import { FullscreenAdViewer } from "../video-profile/FullscreenAdViewer";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";

interface GridViewModeProps {
  ads: DatingAd[];
  isLoading?: boolean;
}

export const GridViewMode = ({ ads, isLoading }: GridViewModeProps) => {
  const [selectedAd, setSelectedAd] = useState<DatingAd | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="aspect-[4/5] rounded-xl bg-gradient-to-br from-luxury-dark/80 to-black/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!ads || ads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-luxury-neutral">No ads found matching your criteria</p>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <AnimatePresence>
          {ads.map((ad, index) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: Math.min(index * 0.05, 0.5) } 
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <AdCard 
                ad={ad} 
                onSelect={setSelectedAd} 
                isMobile={isMobile} 
              />
            </motion.div>
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
    </>
  );
};
