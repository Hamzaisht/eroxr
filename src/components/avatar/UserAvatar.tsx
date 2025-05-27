
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserAvatar } from "@/hooks/useUserAvatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  userId?: string | null;
  username?: string | null;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackClassName?: string;
}

export const UserAvatar = ({ 
  userId, 
  username, 
  email,
  size = 'md',
  className = "",
  fallbackClassName = ""
}: UserAvatarProps) => {
  const { avatar, isLoading } = useUserAvatar(userId);

  const getInitials = () => {
    if (username) return username.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return '?';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-14 w-14';
      case 'xl': return 'h-24 w-24';
      default: return 'h-10 w-10';
    }
  };

  return (
    <Avatar className={cn(getSizeClass(), className)}>
      <AvatarImage 
        src={avatar?.url} 
        alt={username || email || "User avatar"}
        className={isLoading ? "opacity-50" : ""}
      />
      <AvatarFallback className={cn("bg-luxury-darker text-luxury-neutral", fallbackClassName)}>
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};
