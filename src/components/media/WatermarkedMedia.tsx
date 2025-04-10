
import React, { useState, useEffect } from 'react';
import { getUsernameForWatermark } from '@/utils/watermarkUtils';
import { useSession } from "@supabase/auth-helpers-react";
import '../../styles/watermark.css';
import { UniversalMedia } from './UniversalMedia';

interface WatermarkedMediaProps {
  src: string;
  type: 'image' | 'video';
  creatorId: string;
  className?: string;
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

export const WatermarkedMedia: React.FC<WatermarkedMediaProps> = ({
  src,
  type,
  creatorId,
  className = '',
  videoProps,
  imageProps
}) => {
  const [username, setUsername] = useState<string>('eroxr');
  const session = useSession();
  
  // Fetch username for watermark
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const name = await getUsernameForWatermark(creatorId);
        setUsername(name);
      } catch (error) {
        console.error('Error fetching username for watermark:', error);
      }
    };
    
    fetchUsername();
  }, [creatorId]);
  
  // Check if this is the current user's own content
  const isOwnContent = session?.user?.id === creatorId;
  
  const mediaItem = {
    media_url: type === 'image' ? src : null,
    video_url: type === 'video' ? src : null,
    media_type: type,
    creator_id: creatorId,
  };
  
  return (
    <div className="relative">
      <UniversalMedia 
        item={mediaItem}
        className={className}
        showWatermark={true}
      />
      
      {/* CSS-based watermark overlay - rendered on all content */}
      <div className="watermark-overlay">
        www.eroxr.com/@{username}
      </div>
    </div>
  );
};
