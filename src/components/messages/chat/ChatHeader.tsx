
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, Info } from "lucide-react";

interface ChatHeaderProps {
  recipientProfile: any;
  recipientId: string;
  onVoiceCall: () => void;
  onVideoCall: () => void;
  onToggleDetails: () => void;
}

export const ChatHeader = ({
  recipientProfile,
  onVoiceCall,
  onVideoCall,
  onToggleDetails
}: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={recipientProfile?.avatar_url} />
          <AvatarFallback>{recipientProfile?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold text-white">
            {recipientProfile?.username || 'Loading...'}
          </h2>
          <p className="text-sm text-white/60">{recipientProfile?.status || 'offline'}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onVoiceCall}>
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onVideoCall}>
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleDetails}>
          <Info className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
