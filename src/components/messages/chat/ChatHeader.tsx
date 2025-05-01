
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown, Info, MoreVertical, Phone, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ChatHeaderProps {
  username: string;
  avatarUrl?: string;
  isOnline?: boolean;
  onInfoClick: () => void;
  onBack: () => void;
}

export const ChatHeader = ({ username, avatarUrl, isOnline, onInfoClick, onBack }: ChatHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <div className="flex items-center justify-between p-3 border-b border-luxury-neutral/20 bg-luxury-darker">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden h-8 w-8 rounded-full"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Avatar>
              <AvatarImage src={avatarUrl} alt={username} />
              <AvatarFallback>{username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            {isOnline && (
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-luxury-darker rounded-full" />
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="font-medium">{username}</span>
            <span className="text-xs text-luxury-neutral/60">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {/* Chat details button - Make it more visible */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full border border-luxury-neutral/20 hover:border-luxury-neutral/40 hover:bg-luxury-neutral/10"
          onClick={onInfoClick}
          title="Chat details"
        >
          <Info className="h-4 w-4" />
        </Button>

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-luxury-darker border-luxury-neutral/20 text-white">
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Phone className="h-4 w-4" />
              <span>Voice call</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Video className="h-4 w-4" />
              <span>Video call</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-luxury-neutral/20" />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={onInfoClick}>
              <Info className="h-4 w-4" />
              <span>View details</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
