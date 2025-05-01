
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical,
  Circle
} from "lucide-react";

interface ChatHeaderProps {
  recipientProfile: {
    username: string;
    avatar_url?: string;
    online_status?: string;
  };
  recipientId: string;
  onBack: () => void;
  onVoiceCall: () => void;
  onVideoCall: () => void;
  onToggleDetails: () => void;
  isTyping?: boolean;
}

export const ChatHeader = ({
  recipientProfile,
  recipientId,
  onBack,
  onVoiceCall,
  onVideoCall,
  onToggleDetails,
  isTyping
}: ChatHeaderProps) => {
  const isOnline = recipientProfile.online_status === 'online';
  
  return (
    <div className="bg-luxury-darker border-b border-luxury-neutral/20 p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Avatar>
              <AvatarImage src={recipientProfile.avatar_url || ""} />
              <AvatarFallback>
                {recipientProfile.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            
            {isOnline && (
              <div className="absolute bottom-0 right-0">
                <Circle className="h-3 w-3 fill-green-500 text-green-500" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-sm font-medium">{recipientProfile.username}</h2>
            <div className="text-xs text-luxury-neutral/70">
              {isTyping ? (
                <span className="text-luxury-primary/80">Typing...</span>
              ) : (
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={onVoiceCall}
        >
          <Phone className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={onVideoCall}
        >
          <Video className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={onToggleDetails}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
