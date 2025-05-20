
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import { ProfileInfoProps } from './types';

export function ProfileInfo({ ad, isPreviewMode = false }: ProfileInfoProps) {
  return (
    <div className={`flex flex-col gap-1 ${isPreviewMode ? "py-2" : "py-4"}`}>
      <div className="flex items-baseline justify-between">
        <h3 className="font-bold text-white text-lg truncate">{ad.title || 'Untitled Profile'}</h3>
        {ad.age && <span className="text-white/90 text-sm">{ad.age} y/o</span>}
      </div>
      
      <div className="flex items-center text-sm text-white/80 gap-2">
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          <span>{ad.location || ad.city || 'Unknown location'}</span>
        </div>
        {ad.last_active && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(ad.last_active).toLocaleDateString()}</span>
          </div>
        )}
      </div>
      
      {ad.tags && ad.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {ad.tags.slice(0, isPreviewMode ? 2 : 4).map((tag, index) => (
            <Badge 
              key={`${tag}-${index}`}
              variant="outline" 
              className="text-xs bg-black/30 text-white border-white/30"
            >
              {tag}
            </Badge>
          ))}
          {ad.tags.length > (isPreviewMode ? 2 : 4) && (
            <Badge 
              variant="outline" 
              className="text-xs bg-black/30 text-white border-white/30"
            >
              +{ad.tags.length - (isPreviewMode ? 2 : 4)}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
