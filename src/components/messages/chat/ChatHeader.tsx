import { PhoneCall, Video, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { usePresence } from "@/components/profile/avatar/usePresence";

interface ChatHeaderProps {
  recipientProfile: any;
  recipientId: string;
  onBack?: () => void;
  onVoiceCall: () => void;  // Added this prop
  onVideoCall: () => void;  // Added this prop
}

export const ChatHeader = ({ 
  recipientProfile, 
  recipientId,
  onBack,
  onVoiceCall,
  onVideoCall
}: ChatHeaderProps) => {
  const { availability, lastActive } = usePresence(recipientId, false);

  return (
    <div className="flex items-center justify-between p-3 border-b border-luxury-neutral/10 bg-white/5 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-luxury-neutral/10"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 ring-2 ring-luxury-primary/20">
            <AvatarImage src={recipientProfile?.avatar_url} />
            <AvatarFallback>{recipientProfile?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-luxury-neutral">
              {recipientProfile?.username}
            </span>
            <span className="text-xs text-luxury-neutral/70">
              {availability === 'online' ? 'Active now' : 
                lastActive ? `Active ${formatDistanceToNow(new Date(lastActive), { addSuffix: true })}` : 
                'Offline'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-luxury-neutral/10 text-luxury-neutral/70 hover:text-luxury-primary"
          onClick={onVoiceCall}
        >
          <PhoneCall className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-luxury-neutral/10 text-luxury-neutral/70 hover:text-luxury-primary"
          onClick={onVideoCall}
        >
          <Video className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};