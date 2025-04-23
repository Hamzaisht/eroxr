
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Settings, 
  Flag, 
  UserX, 
  Search,
  ArrowLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  recipientProfile: any;
  recipientId: string;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  onToggleDetails?: () => void;
  isTyping?: boolean;
  onBack?: () => void;
}

export const ChatHeader = ({ 
  recipientProfile,
  recipientId,
  onVoiceCall,
  onVideoCall,
  onToggleDetails,
  isTyping,
  onBack
}: ChatHeaderProps) => {
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const handleReport = () => {
    toast({
      description: "Report functionality will be implemented soon"
    });
  };
  
  const handleBlock = () => {
    toast({
      description: "Block functionality will be implemented soon"
    });
  };

  // For demo: toggle active state when clicked
  const toggleActive = () => setIsActive(prev => !prev);

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-luxury-darker/60 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center space-x-3">
        {isMobile && onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mr-1 rounded-full hover:bg-white/10"
            onClick={onBack}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div className="relative" onClick={toggleActive}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={recipientProfile.avatar_url} />
            <AvatarFallback>
              {recipientProfile.username?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <span className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-luxury-dark",
            isActive ? "bg-green-500" : "bg-gray-400"
          )} />
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-white">
            {recipientProfile.username}
          </h3>
          
          <p className="text-xs text-white/60">
            {isTyping ? (
              <span className="text-luxury-primary inline-flex items-center">
                <span className="animate-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                <span className="ml-1">typing...</span>
              </span>
            ) : isActive ? (
              'Online'
            ) : (
              'Offline'
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-white/10"
          onClick={() => {
            toast({
              description: "Search functionality will be implemented soon"
            });
          }}
          aria-label="Search in conversation"
        >
          <Search className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onVoiceCall}
          className="h-8 w-8 rounded-full hover:bg-white/10"
          aria-label="Start voice call"
        >
          <Phone className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onVideoCall}
          className="h-8 w-8 rounded-full hover:bg-white/10"
          aria-label="Start video call"
        >
          <Video className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-white/10"
              aria-label="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-black/80 backdrop-blur-sm border-white/10"
          >
            <DropdownMenuItem 
              onClick={onToggleDetails}
              className="text-sm cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-2" />
              Chat settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              onClick={handleReport}
              className="text-sm cursor-pointer"
            >
              <Flag className="h-4 w-4 mr-2" />
              Report
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleBlock}
              className="text-sm cursor-pointer text-red-500"
            >
              <UserX className="h-4 w-4 mr-2" />
              Block user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
