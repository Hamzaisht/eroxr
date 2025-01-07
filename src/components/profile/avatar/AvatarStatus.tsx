import { AvailabilityIndicator, AvailabilityStatus } from "@/components/ui/availability-indicator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

interface AvatarStatusProps {
  profileId: string;
  isOwnProfile: boolean;
  status: AvailabilityStatus;
  onStatusChange?: (status: AvailabilityStatus) => void;
}

export const AvatarStatus = ({ 
  profileId, 
  isOwnProfile, 
  status, 
  onStatusChange 
}: AvatarStatusProps) => {
  const updateStatus = async (newStatus: AvailabilityStatus) => {
    if (!isOwnProfile) return;
    
    const channel = supabase.channel('online-users');
    await channel.track({
      user_id: profileId,
      status: newStatus,
      timestamp: new Date().toISOString()
    });
    
    onStatusChange?.(newStatus);
  };

  return isOwnProfile ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0.5 h-auto rounded-full bg-white/90 shadow-md hover:bg-white">
          <AvailabilityIndicator status={status} size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => updateStatus("online")} className="gap-2">
          <AvailabilityIndicator status="online" size={12} />
          <span>Online</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("away")} className="gap-2">
          <AvailabilityIndicator status="away" size={12} />
          <span>Away</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("busy")} className="gap-2">
          <AvailabilityIndicator status="busy" size={12} />
          <span>Busy</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("offline")} className="gap-2">
          <AvailabilityIndicator status="offline" size={12} />
          <span>Appear Offline</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="p-0.5 rounded-full bg-white/90 shadow-md">
      <AvailabilityIndicator status={status} size={14} />
    </div>
  );
};