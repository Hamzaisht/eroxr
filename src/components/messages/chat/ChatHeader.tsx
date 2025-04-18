
import { useMediaQuery } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, Info, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="p-3 md:p-4 border-b border-white/10 bg-luxury-darker/50 backdrop-blur-md flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Link to="/messages" className="mr-1">
            <ChevronLeft className="h-5 w-5 text-luxury-neutral" />
          </Link>
        )}
        
        <Avatar className="h-10 w-10 border border-white/10">
          <AvatarImage src={recipientProfile?.avatar_url || undefined} />
          <AvatarFallback>
            {recipientProfile?.username?.[0]?.toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-luxury-neutral">
              {recipientProfile?.username || 'User'}
            </h3>
            {recipientProfile?.is_verified && (
              <span className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white">✓</span>
            )}
          </div>
          <p className={cn(
            "text-xs",
            isTyping
              ? "text-luxury-primary animate-pulse"
              : recipientProfile?.status === "online"
              ? "text-emerald-400"
              : "text-luxury-neutral/50"
          )}>
            {isTyping
              ? "typing..."
              : recipientProfile?.status === "online"
              ? "online"
              : "offline"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-luxury-darker/60 hover:bg-luxury-darker/90"
          onClick={onVoiceCall}
        >
          <Phone className="h-4 w-4 text-luxury-neutral" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-luxury-darker/60 hover:bg-luxury-darker/90"
          onClick={onVideoCall}
        >
          <Video className="h-4 w-4 text-luxury-neutral" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-luxury-darker/60 hover:bg-luxury-darker/90"
          onClick={onToggleDetails}
        >
          <Info className="h-4 w-4 text-luxury-neutral" />
        </Button>
      </div>
    </div>
  );
};
