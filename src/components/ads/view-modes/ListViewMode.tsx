
import { useState } from 'react';
import { DatingAd } from '../types/dating';
import { Eye, MessageCircle, Map, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FullscreenAdViewer } from '../video-profile/FullscreenAdViewer';
import { motion } from 'framer-motion';

interface ListViewModeProps {
  ads: DatingAd[];
}

export const ListViewMode = ({ ads }: ListViewModeProps) => {
  const [selectedAd, setSelectedAd] = useState<DatingAd | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full space-y-6">
      {ads.map((ad) => (
        <motion.div
          key={ad.id}
          whileHover={{ scale: 1.01 }}
          onClick={() => setSelectedAd(ad)}
          onMouseEnter={() => setHoveredId(ad.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="bg-luxury-dark/30 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer"
        >
          <div className="grid grid-cols-[250px,1fr] md:grid-cols-[350px,1fr]">
            {/* Video Thumbnail */}
            <div className="relative h-full min-h-[200px]">
              {ad.video_url ? (
                <video
                  src={ad.video_url}
                  className="w-full h-full object-cover absolute inset-0"
                  loop
                  muted
                  playsInline
                  autoPlay={hoveredId === ad.id}
                  controls={false}
                />
              ) : (
                <div className="w-full h-full bg-luxury-darker/50 flex items-center justify-center">
                  <p className="text-luxury-neutral">No video</p>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
            </div>
            
            {/* Ad Info */}
            <div className="p-4 flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{ad.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-luxury-neutral/80 mb-3">
                    <div className="flex items-center gap-1">
                      <Map className="h-4 w-4" />
                      {ad.city}, {ad.country}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {ad.age_range.lower}-{ad.age_range.upper}
                    </div>
                  </div>
                </div>
                
                {ad.avatar_url && (
                  <img 
                    src={ad.avatar_url}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-luxury-primary"
                  />
                )}
              </div>
              
              <p className="text-luxury-neutral/70 line-clamp-2 mb-3 text-sm">{ad.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(ad.looking_for) && ad.looking_for.map(type => (
                  <Badge key={type} className="bg-luxury-primary/80 text-white">
                    {type}
                  </Badge>
                ))}
                
                {ad.tags && ad.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="bg-luxury-dark/50 text-luxury-neutral border-none">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="mt-auto flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-luxury-neutral/80">
                  <Eye className="h-4 w-4" />
                  <span>{ad.view_count || 0} views</span>
                </div>
                <div className="flex items-center gap-1 text-luxury-neutral/80">
                  <MessageCircle className="h-4 w-4" />
                  <span>{ad.message_count || 0} replies</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
      
      {selectedAd && (
        <FullscreenAdViewer 
          ad={selectedAd} 
          onClose={() => setSelectedAd(null)} 
        />
      )}
    </div>
  );
};
