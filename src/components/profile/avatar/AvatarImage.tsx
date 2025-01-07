import { Avatar, AvatarFallback, AvatarImage as UIAvatarImage } from "@/components/ui/avatar";

interface AvatarImageProps {
  src?: string | null;
  username?: string | null;
  onImageClick?: () => void;
}

export const ProfileAvatarImage = ({ src, username, onImageClick }: AvatarImageProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onImageClick) {
      onImageClick();
    }
  };

  return (
    <Avatar 
      className="h-48 w-48 rounded-full overflow-hidden bg-luxury-darker cursor-pointer [&:hover]:shadow-[0_0_50px_rgba(217,70,239,0.25)]"
      onClick={handleClick}
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