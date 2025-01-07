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
        <Button variant="ghost" className="p-1 h-auto rounded-full bg-black/20 backdrop-blur-lg hover:bg-black/30 transition-all duration-300">
          <AvailabilityIndicator status={status} size={12} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-black/40 backdrop-blur-xl border-none shadow-2xl">
        <DropdownMenuItem onClick={() => updateStatus("online")} className="gap-2 hover:bg-white/5">
          <AvailabilityIndicator status="online" size={10} />
          <span className="text-white/90">Online</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("away")} className="gap-2 hover:bg-white/5">
          <AvailabilityIndicator status="away" size={10} />
          <span className="text-white/90">Away</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("busy")} className="gap-2 hover:bg-white/5">
          <AvailabilityIndicator status="busy" size={10} />
          <span className="text-white/90">Busy</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus("offline")} className="gap-2 hover:bg-white/5">
          <AvailabilityIndicator status="offline" size={10} />
          <span className="text-white/90">Appear Offline</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="p-1 rounded-full bg-black/20 backdrop-blur-lg">
      <AvailabilityIndicator status={status} size={12} />
    </div>
  );
};