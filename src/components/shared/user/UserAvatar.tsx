
import { UserAvatar as BaseUserAvatar } from "@/components/avatar/UserAvatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { AvailabilityIndicator, AvailabilityStatus } from "@/components/ui/availability-indicator";

interface UserAvatarProps {
  userId?: string | null;
  username?: string | null;
  email?: string | null;
  status?: AvailabilityStatus;
  onStatusChange?: (status: AvailabilityStatus) => void;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

export const UserAvatar = ({ 
  userId,
  username,
  email,
  status = 'offline',
  onStatusChange,
  size = 'md',
  showStatus = true
}: UserAvatarProps) => {

  if (!onStatusChange || !showStatus) {
    return (
      <div className="relative">
        <BaseUserAvatar 
          userId={userId}
          username={username}
          email={email}
          size={size}
          className="border-2 border-luxury-primary/30"
        />
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
          <BaseUserAvatar 
            userId={userId}
            username={username}
            email={email}
            size={size}
            className="border-2 border-luxury-primary/30"
          />
          {showStatus && status && (
            <AvailabilityIndicator
              status={status}
              className="absolute bottom-0 right-0 ring-2 ring-black"
            />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onStatusChange('online')}>
          <AvailabilityIndicator status="online" className="mr-2" />
          <span>Online</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('away')}>
          <AvailabilityIndicator status="away" className="mr-2" />
          <span>Away</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('busy')}>
          <AvailabilityIndicator status="busy" className="mr-2" />
          <span>Do Not Disturb</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onStatusChange('offline')}>
          <AvailabilityIndicator status="offline" className="mr-2" />
          <span>Appear Offline</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
