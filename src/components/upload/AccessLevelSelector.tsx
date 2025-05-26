
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Users, CreditCard, Globe } from "lucide-react";
import { MediaAccessLevel } from "@/utils/media/types";

interface AccessLevelSelectorProps {
  value: MediaAccessLevel;
  onChange: (value: MediaAccessLevel) => void;
  showPPV?: boolean;
  className?: string;
}

export const AccessLevelSelector = ({ 
  value, 
  onChange, 
  showPPV = true,
  className = "" 
}: AccessLevelSelectorProps) => {
  const accessLevels = [
    {
      value: MediaAccessLevel.PUBLIC,
      label: "Public",
      description: "Everyone can see this",
      icon: <Globe className="w-4 h-4" />
    },
    {
      value: MediaAccessLevel.SUBSCRIBERS,
      label: "Subscribers Only", 
      description: "Only your subscribers can see this",
      icon: <Users className="w-4 h-4" />
    },
    ...(showPPV ? [{
      value: MediaAccessLevel.PPV,
      label: "Pay Per View",
      description: "Charge for access to this content",
      icon: <CreditCard className="w-4 h-4" />
    }] : []),
    {
      value: MediaAccessLevel.PRIVATE,
      label: "Private",
      description: "Only you can see this",
      icon: <Lock className="w-4 h-4" />
    }
  ];

  return (
    <div className={className}>
      <label className="text-sm font-medium text-luxury-neutral mb-2 block">
        Who can see this content?
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select visibility" />
        </SelectTrigger>
        <SelectContent>
          {accessLevels.map((level) => (
            <SelectItem key={level.value} value={level.value}>
              <div className="flex items-center gap-2">
                {level.icon}
                <div>
                  <div className="font-medium">{level.label}</div>
                  <div className="text-xs text-luxury-neutral/60">{level.description}</div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
