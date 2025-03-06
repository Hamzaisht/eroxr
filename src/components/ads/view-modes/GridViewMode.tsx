
import { useState } from 'react';
import { DatingAd } from '../types/dating';
import { VideoProfileCard } from '../video-profile-card';
import { FullscreenAdViewer } from '../video-profile/FullscreenAdViewer';
import { motion } from 'framer-motion';

interface GridViewModeProps {
  ads: DatingAd[];
}

export const GridViewMode = ({ ads }: GridViewModeProps) => {
  const [selectedAd, setSelectedAd] = useState<DatingAd | null>(null);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ads.map((ad) => (
          <motion.div
            key={ad.id}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => setSelectedAd(ad)}
          >
            <VideoProfileCard ad={ad} isPreviewMode={true} />
          </motion.div>
        ))}
      </div>

      {selectedAd && (
        <FullscreenAdViewer 
          ad={selectedAd} 
          onClose={() => setSelectedAd(null)} 
        />
      )}
    </div>
  );
};
