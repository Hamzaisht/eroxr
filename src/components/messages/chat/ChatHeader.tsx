
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvailabilityIndicator } from "@/components/ui/availability-indicator";
import { Button } from "@/components/ui/button";
import { Phone, Video, Info, PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  recipientProfile: any;
  recipientId: string;
  onVoiceCall: () => void;
  onVideoCall: () => void;
  onToggleDetails: () => void;
  isTyping?: boolean;
}

export const ChatHeader = ({ 
  recipientProfile, 
  recipientId,
  onVoiceCall,
  onVideoCall,
  onToggleDetails,
  isTyping = false
}: ChatHeaderProps) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  
  if (!recipientProfile) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-luxury-dark-secondary">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-luxury-neutral/20 animate-pulse" />
          <div className="h-5 w-32 rounded-md bg-luxury-neutral/20 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-luxury-neutral/10 bg-luxury-dark-secondary">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-10 w-10 border border-luxury-neutral/10">
            <AvatarImage src={recipientProfile.avatar_url} />
            <AvatarFallback>{recipientProfile.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5">
            <AvailabilityIndicator 
              status={recipientProfile.status || "offline"} 
              size={12} 
            />
          </div>
        </div>
        
        <div>
          <div className="font-medium text-luxury-text">
            {recipientProfile.username}
          </div>
          <div className="text-xs text-luxury-neutral/70">
            {isTyping ? (
              <div className="flex items-center text-luxury-primary">
                <PenSquare className="h-3 w-3 mr-1 animate-pulse" />
                <span>typing...</span>
              </div>
            ) : (
              <span>{recipientProfile.status || "offline"}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
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
          className={cn("rounded-full", isOptionsOpen && "bg-luxury-neutral/10")}
          onClick={() => {
            setIsOptionsOpen(!isOptionsOpen);
            onToggleDetails();
          }}
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
