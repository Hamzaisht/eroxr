
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaAccessLevel } from '@/utils/media/types';

interface AccessLevelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const AccessLevelSelector = ({ value, onChange, disabled = false }: AccessLevelSelectorProps) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Access Level" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={MediaAccessLevel.PUBLIC}>
          <div className="flex items-center">
            <span className="ml-2">Public - Everyone</span>
          </div>
        </SelectItem>
        
        <SelectItem value={MediaAccessLevel.PRIVATE}>
          <div className="flex items-center">
            <span className="ml-2">Private - Only You</span>
          </div>
        </SelectItem>
        
        <SelectItem value={MediaAccessLevel.FOLLOWERS}>
          <div className="flex items-center">
            <span className="ml-2">Followers Only</span>
          </div>
        </SelectItem>
        
        <SelectItem value={MediaAccessLevel.SUBSCRIBERS}>
          <div className="flex items-center">
            <span className="ml-2">Subscribers Only</span>
          </div>
        </SelectItem>
        
        <SelectItem value={MediaAccessLevel.PPV}>
          <div className="flex items-center">
            <span className="ml-2">Pay Per View</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
