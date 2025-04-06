
import React, { useState, useEffect, useRef } from 'react';
import { getUsernameForWatermark } from '@/utils/watermarkUtils';
import { useSession } from "@supabase/auth-helpers-react";
import '../../styles/watermark.css';

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
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
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
  
  return (
    <div className="relative">
      {type === 'video' ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={src}
          className={className}
          {...videoProps}
        />
      ) : (
        <img
          ref={mediaRef as React.RefObject<HTMLImageElement>}
          src={src}
          className={className}
          {...imageProps}
        />
      )}
      
      {/* CSS-based watermark overlay - rendered on all content */}
      <div className="watermark-overlay">
        www.eroxr.com/@{username}
      </div>
    </div>
  );
};
