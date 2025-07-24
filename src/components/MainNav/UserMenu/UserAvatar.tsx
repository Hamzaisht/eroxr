
import { UserAvatar as BaseUserAvatar } from "@/components/avatar/UserAvatar";
import { Button } from "@/components/ui/button";
import { AvailabilityIndicator, AvailabilityStatus } from "@/components/ui/availability-indicator";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";

interface UserAvatarProps {
  status?: AvailabilityStatus;
  onStatusChange?: (status: AvailabilityStatus) => void;
}

export const UserAvatar = ({ 
  status = 'offline', 
  onStatusChange 
}: UserAvatarProps) => {
  const session = useSession();
  const navigate = useNavigate();

  const handleStatusClick = (e: React.MouseEvent) => {
    if (onStatusChange) {
      e.stopPropagation();
      onStatusChange(status === 'online' ? 'offline' : 'online');
    }
  };

  const handleAvatarClick = () => {
    if (session?.user?.id) {
      navigate('/profile');
    }
  };

  return (
    <Button 
      variant="ghost" 
      className="relative h-10 w-10 rounded-full p-0 hover:bg-white/5"
      onClick={handleAvatarClick}
    >
      <BaseUserAvatar 
        userId={session?.user?.id}
        username={session?.user?.user_metadata?.username}
        email={session?.user?.email}
        size="md"
        clickable={false}
        className="ring-2 ring-luxury-primary/10 transition-all duration-200 hover:ring-luxury-primary/20"
      />
      {onStatusChange && (
        <div className="absolute -bottom-1 -right-1">
          <AvailabilityIndicator 
            status={status}
            className="cursor-pointer"
            onClick={handleStatusClick}
          />
        </div>
      )}
    </Button>
  );
};
