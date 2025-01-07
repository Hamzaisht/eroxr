import { Avatar, AvatarFallback, AvatarImage as UIAvatarImage } from "@/components/ui/avatar";

interface AvatarImageProps {
  src?: string | null;
  username?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const sizeClasses = {
  sm: "h-20 w-20",
  md: "h-32 w-32",
  lg: "h-48 w-48"
};

export const AvatarImage = ({ src, username, size = "lg", onClick }: AvatarImageProps) => {
  return (
    <Avatar 
      className={`${sizeClasses[size]} shadow-[0_0_20px_rgba(155,135,245,0.15)] rounded-3xl overflow-hidden bg-luxury-darker transition-all duration-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.25)] cursor-pointer`}
      onClick={onClick}
    >
      <UIAvatarImage 
        src={src || undefined}
        className="h-full w-full object-cover transition-transform duration-500"
      />
      <AvatarFallback className="text-4xl bg-luxury-darker text-luxury-primary">
        {username?.[0]?.toUpperCase() || "?"}
      </AvatarFallback>
    </Avatar>
  );
};