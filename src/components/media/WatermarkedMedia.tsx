
import React, { useState, useEffect, useRef } from 'react';
import { getUsernameForWatermark } from '@/utils/watermarkUtils';
import { useSession } from "@supabase/auth-helpers-react";

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
      
      <style jsx>{`
        .watermark-overlay {
          position: absolute;
          bottom: 8px;
          right: 8px;
          padding: 4px 6px;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          font-size: 14px;
          font-weight: 600;
          font-family: sans-serif;
          border-radius: 2px;
          pointer-events: none;
          z-index: 10;
        }
        
        @media screen and (min-width: 768px) {
          .watermark-overlay {
            font-size: 18px;
            padding: 6px 8px;
          }
        }
      `}</style>
    </div>
  );
};
