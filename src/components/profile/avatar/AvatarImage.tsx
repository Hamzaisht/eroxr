import { Avatar, AvatarFallback, AvatarImage as UIAvatarImage } from "@/components/ui/avatar";
import { AvailabilityIndicator } from "@/components/ui/availability-indicator";
import type { AvailabilityStatus } from "@/components/ui/availability-indicator";

interface AvatarImageProps {
  src?: string | null;
  username?: string | null;
  onClick?: () => void;
  status?: AvailabilityStatus;
}

export const ProfileAvatarImage = ({ src, username, onClick, status = "offline" }: AvatarImageProps) => {
  return (
    <div className="relative">
      <Avatar 
        className="h-48 w-48 shadow-[0_0_30px_rgba(155,135,245,0.15)] rounded-3xl overflow-hidden bg-luxury-darker transition-all duration-500 hover:shadow-[0_0_50px_rgba(217,70,239,0.25)] cursor-pointer"
        onClick={onClick}
      >
        <UIAvatarImage 
          src={src || ""} 
          alt={username || "Avatar"}
          className="h-full w-full object-cover transition-transform duration-500"
        />
        <AvatarFallback className="text-4xl bg-luxury-darker text-luxury-primary">
          {username?.[0]?.toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white shadow-md">
        <AvailabilityIndicator status={status} size={16} />
      </div>
    </div>
  );
};