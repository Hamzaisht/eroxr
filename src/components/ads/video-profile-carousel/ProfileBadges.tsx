
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Check, Crown } from "lucide-react";
import { ProfileBadgesProps } from './types';

export function ProfileBadges({ ad }: ProfileBadgesProps) {
  const isPremium = ad.isPremium || ad.is_premium;
  const isVerified = ad.isVerified || ad.is_verified;
  
  return (
    <div className="absolute top-4 left-0 right-0 z-20 px-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        {isVerified && (
          <Badge variant="secondary" className="flex items-center gap-1 bg-blue-600/90 hover:bg-blue-700 text-white">
            <Check className="h-3 w-3" />
            <span>Verified</span>
          </Badge>
        )}
      </div>
      {isPremium && (
        <Badge variant="secondary" className="flex items-center gap-1 bg-amber-600/90 hover:bg-amber-700 text-white">
          <Crown className="h-3 w-3" />
          <span>Premium</span>
        </Badge>
      )}
    </div>
  );
}
