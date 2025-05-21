
import React from 'react';
import { Shield, Users, Crown, CreditCard, Lock } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { MediaAccessLevel } from '@/utils/media/types';

interface AccessLevelSelectorProps {
  value: MediaAccessLevel;
  onChange: (value: MediaAccessLevel) => void;
  disabled?: boolean;
}

export const AccessLevelSelector: React.FC<AccessLevelSelectorProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const handleValueChange = (newValue: string) => {
    onChange(newValue as MediaAccessLevel);
  };
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Access Level</label>
      <Select 
        value={value} 
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select access level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={MediaAccessLevel.PUBLIC}>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              <span>Public (Everyone)</span>
            </div>
          </SelectItem>
          <SelectItem value={MediaAccessLevel.FOLLOWERS}>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              <span>Followers Only</span>
            </div>
          </SelectItem>
          <SelectItem value={MediaAccessLevel.SUBSCRIBERS}>
            <div className="flex items-center">
              <Crown className="h-4 w-4 mr-2 text-amber-500" />
              <span>Subscribers Only</span>
            </div>
          </SelectItem>
          <SelectItem value={MediaAccessLevel.PPV}>
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-purple-500" />
              <span>Pay Per View</span>
            </div>
          </SelectItem>
          <SelectItem value={MediaAccessLevel.PRIVATE}>
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2 text-red-500" />
              <span>Private (Only Me)</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
