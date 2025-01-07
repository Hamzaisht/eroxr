import { Avatar, AvatarFallback, AvatarImage as UIAvatarImage } from "@/components/ui/avatar";
import { AvailabilityIndicator } from "@/components/ui/availability-indicator";
import type { AvailabilityStatus } from "@/components/ui/availability-indicator";

interface AvatarImageProps {
  src?: string | null;
  username?: string | null;
  onClick?: () => void;
  status?: AvailabilityStatus;
}

export const ProfileAvatarImage = ({ src, username, onClick }: AvatarImageProps) => {
  return (
    <Avatar 
      className="h-48 w-48 rounded-full overflow-hidden bg-luxury-darker hover:shadow-[0_0_50px_rgba(217,70,239,0.25)] cursor-pointer transition-shadow duration-500"
      onClick={onClick}
    >
      <UIAvatarImage 
        src={src || ""} 
        alt={username || "Avatar"}
        className="h-full w-full object-cover"
      />
      <AvatarFallback className="text-4xl bg-luxury-darker text-luxury-primary">
        {username?.[0]?.toUpperCase() || "?"}
      </AvatarFallback>
    </Avatar>
  );
};