
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvailabilityIndicator, AvailabilityStatus } from "@/components/ui/availability-indicator";

interface UserAvatarProps {
  avatarUrl?: string | null;
  email?: string | null;
  status?: AvailabilityStatus;
  onStatusChange?: (status: AvailabilityStatus) => void;
}

export const UserAvatar = ({ avatarUrl, email, status = AvailabilityStatus.OFFLINE, onStatusChange }: UserAvatarProps) => {
  return (
    <Button 
      variant="ghost" 
      className="relative h-10 w-10 rounded-full p-0 hover:bg-white/5"
    >
      <Avatar className="h-10 w-10 ring-2 ring-luxury-primary/10 transition-all duration-200 hover:ring-luxury-primary/20">
        <AvatarImage 
          src={avatarUrl || ""} 
          alt={email || "User avatar"} 
          className="object-cover"
        />
        <AvatarFallback className="bg-luxury-darker text-luxury-primary">
          {email?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      {onStatusChange && (
        <div className="absolute -bottom-1 -right-1">
          <AvailabilityIndicator 
            status={status} 
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(status === AvailabilityStatus.ONLINE ? AvailabilityStatus.OFFLINE : AvailabilityStatus.ONLINE);
            }}
          />
        </div>
      )}
    </Button>
  );
};
