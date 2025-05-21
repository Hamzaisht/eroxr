
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Lock, Users, Globe, Crown, Star } from 'lucide-react';
import { MediaAccessLevel } from '@/utils/media/types';

interface AccessLevelSelectorProps {
  value: MediaAccessLevel;
  onChange: (value: MediaAccessLevel) => void;
  label?: string;
  disabled?: boolean;
}

export function AccessLevelSelector({
  value,
  onChange,
  label = "Access Level",
  disabled = false
}: AccessLevelSelectorProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select
        value={value}
        onValueChange={(val: string) => onChange(val as MediaAccessLevel)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select access level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={MediaAccessLevel.PUBLIC}>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>Public</span>
            </div>
          </SelectItem>
          
          <SelectItem value={MediaAccessLevel.FOLLOWERS}>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Followers Only</span>
            </div>
          </SelectItem>
          
          <SelectItem value={MediaAccessLevel.SUBSCRIBER}>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-muted-foreground" />
              <span>Subscribers Only</span>
            </div>
          </SelectItem>
          
          <SelectItem value={MediaAccessLevel.PAID}>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span>Pay-Per-View</span>
            </div>
          </SelectItem>
          
          <SelectItem value={MediaAccessLevel.PRIVATE}>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span>Private</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
