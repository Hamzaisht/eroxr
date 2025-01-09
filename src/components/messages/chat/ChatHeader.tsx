import { PhoneCall, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvailabilityIndicator } from "@/components/ui/availability-indicator";
import { formatDistanceToNow } from "date-fns";
import { usePresence } from "@/components/profile/avatar/usePresence";

interface ChatHeaderProps {
  recipientProfile: any;
  recipientId: string;
  onVoiceCall: () => void;
  onVideoCall: () => void;
}

export const ChatHeader = ({ 
  recipientProfile, 
  recipientId,
  onVoiceCall,
  onVideoCall 
}: ChatHeaderProps) => {
  const { availability, lastActive } = usePresence(recipientId, false);

  return (
    <div className="flex items-center justify-between p-4 border-b border-luxury-neutral/10 bg-white/5 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10 ring-2 ring-luxury-primary/20">
            <AvatarImage src={recipientProfile?.avatar_url} />
            <AvatarFallback>{recipientProfile?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1">
            <AvailabilityIndicator status={availability} size={10} />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-luxury-neutral">{recipientProfile?.username}</span>
          <span className="text-xs text-luxury-neutral/70">
            {availability === 'offline' && lastActive 
              ? `Last seen ${formatDistanceToNow(new Date(lastActive), { addSuffix: true })}` 
              : availability}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-luxury-neutral/10 text-luxury-neutral/70 hover:text-luxury-primary transition-colors"
          onClick={onVoiceCall}
        >
          <PhoneCall className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-luxury-neutral/10 text-luxury-neutral/70 hover:text-luxury-primary transition-colors"
          onClick={onVideoCall}
        >
          <Video className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};