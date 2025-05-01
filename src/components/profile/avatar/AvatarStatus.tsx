
import { AvailabilityIndicator } from "@/components/ui/availability-indicator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AvailabilityStatus } from "@/utils/media/types";

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
  const { toast } = useToast();

  const updateStatus = async (newStatus: AvailabilityStatus) => {
    if (!isOwnProfile) return;
    
    try {
      const channel = supabase.channel('online-users');
      
      await channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: profileId,
            status: newStatus,
            timestamp: new Date().toISOString()
          });
          
          onStatusChange?.(newStatus);
          
          toast({
            description: `Status updated to ${newStatus}`,
            duration: 2000,
          });
        }
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: "destructive",
        description: "Failed to update status",
        duration: 2000,
      });
    }
  };

  return isOwnProfile ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="p-1.5 h-auto rounded-full bg-black/10 backdrop-blur-xl hover:bg-black/20 transition-all duration-300"
        >
          <AvailabilityIndicator status={status} size={12} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-black/30 backdrop-blur-2xl border-none shadow-[0_0_15px_rgba(0,0,0,0.3)] rounded-xl"
      >
        <DropdownMenuItem onClick={() => updateStatus(AvailabilityStatus.ONLINE)} className="gap-2 hover:bg-white/5">
          <AvailabilityIndicator status={AvailabilityStatus.ONLINE} size={10} />
          <span className="text-white/90">Online</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus(AvailabilityStatus.AWAY)} className="gap-2 hover:bg-white/5">
          <AvailabilityIndicator status={AvailabilityStatus.AWAY} size={10} />
          <span className="text-white/90">Away</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus(AvailabilityStatus.BUSY)} className="gap-2 hover:bg-white/5">
          <AvailabilityIndicator status={AvailabilityStatus.BUSY} size={10} />
          <span className="text-white/90">Busy</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus(AvailabilityStatus.OFFLINE)} className="gap-2 hover:bg-white/5">
          <AvailabilityIndicator status={AvailabilityStatus.OFFLINE} size={10} />
          <span className="text-white/90">Appear Offline</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="p-1.5 rounded-full bg-black/10 backdrop-blur-xl">
      <AvailabilityIndicator status={status} size={12} />
    </div>
  );
};
