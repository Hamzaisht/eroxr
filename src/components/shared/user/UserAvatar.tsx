
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AvailabilityIndicator, AvailabilityStatus } from "@/components/ui/availability-indicator";

interface UserAvatarProps {
  avatarUrl?: string | null;
  email?: string | null;
  username?: string | null;
  status?: AvailabilityStatus;
  onStatusChange?: (status: AvailabilityStatus) => void;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

export const UserAvatar = ({ 
  avatarUrl, 
  email, 
  username,
  status = AvailabilityStatus.OFFLINE,
  onStatusChange,
  size = 'md',
  showStatus = true
}: UserAvatarProps) => {
  const getInitials = () => {
    if (username) return username.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return '?';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-14 w-14';
      default: return 'h-10 w-10';
    }
  };

  if (!onStatusChange || !showStatus) {
    return (
      <div className="relative">
        <Avatar className={`${getSizeClass()} border-2 border-luxury-primary/30`}>
          <AvatarImage src={avatarUrl || undefined} alt="User avatar" />
          <AvatarFallback className="bg-luxury-darker text-luxury-neutral">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        {showStatus && status && (
          <AvailabilityIndicator
            status={status}
            className="absolute bottom-0 right-0 ring-2 ring-black"
          />
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Avatar className={`${getSizeClass()} border-2 border-luxury-primary/30`}>
            <AvatarImage src={avatarUrl || undefined} alt="User avatar" />
            <AvatarFallback className="bg-luxury-darker text-luxury-neutral">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          {showStatus && status && (
            <AvailabilityIndicator
              status={status}
              className="absolute bottom-0 right-0 ring-2 ring-black"
            />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onStatusChange(AvailabilityStatus.ONLINE)}>
          <AvailabilityIndicator status={AvailabilityStatus.ONLINE} className="mr-2" />
          <span>Online</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange(AvailabilityStatus.AWAY)}>
          <AvailabilityIndicator status={AvailabilityStatus.AWAY} className="mr-2" />
          <span>Away</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange(AvailabilityStatus.BUSY)}>
          <AvailabilityIndicator status={AvailabilityStatus.BUSY} className="mr-2" />
          <span>Do Not Disturb</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange(AvailabilityStatus.OFFLINE)}>
          <AvailabilityIndicator status={AvailabilityStatus.OFFLINE} className="mr-2" />
          <span>Appear Offline</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
