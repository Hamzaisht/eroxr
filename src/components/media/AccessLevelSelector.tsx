
import { MediaAccessLevel } from "@/utils/media/types";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { LockKeyholeIcon, UsersIcon, HeartIcon, CreditCardIcon, GlobeIcon } from "lucide-react";

interface AccessLevelSelectorProps {
  value: MediaAccessLevel;
  onChange: (value: MediaAccessLevel) => void;
  showLabel?: boolean;
  disabled?: boolean;
}

export function AccessLevelSelector({
  value,
  onChange,
  showLabel = true,
  disabled = false
}: AccessLevelSelectorProps) {
  return (
    <div className="space-y-2">
      {showLabel && <Label>Access Level</Label>}
      
      <Select
        value={value}
        onValueChange={(val) => onChange(val as MediaAccessLevel)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select access level" />
        </SelectTrigger>
        
        <SelectContent>
          <SelectItem value={MediaAccessLevel.PUBLIC}>
            <div className="flex items-center gap-2">
              <GlobeIcon className="h-4 w-4" />
              <span>Public</span>
            </div>
          </SelectItem>
          
          <SelectItem value={MediaAccessLevel.FOLLOWERS}>
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              <span>Followers Only</span>
            </div>
          </SelectItem>
          
          <SelectItem value={MediaAccessLevel.SUBSCRIBERS}>
            <div className="flex items-center gap-2">
              <HeartIcon className="h-4 w-4" />
              <span>Subscribers Only</span>
            </div>
          </SelectItem>
          
          <SelectItem value={MediaAccessLevel.PPV}>
            <div className="flex items-center gap-2">
              <CreditCardIcon className="h-4 w-4" />
              <span>Pay Per View</span>
            </div>
          </SelectItem>
          
          <SelectItem value={MediaAccessLevel.PRIVATE}>
            <div className="flex items-center gap-2">
              <LockKeyholeIcon className="h-4 w-4" />
              <span>Private</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
