
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserAvatar } from "@/hooks/useUserAvatar";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  userId?: string | null;
  username?: string | null;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackClassName?: string;
  clickable?: boolean;
}

export const UserAvatar = ({ 
  userId, 
  username, 
  email,
  size = 'md',
  className = "",
  fallbackClassName = "",
  clickable = true
}: UserAvatarProps) => {
  const { avatar, isLoading } = useUserAvatar(userId);
  const navigate = useNavigate();

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

  const handleClick = () => {
    if (clickable && userId) {
      navigate(`/new-profile/${userId}`);
    }
  };

  return (
    <Avatar 
      className={cn(
        getSizeClass(), 
        clickable && userId ? 'cursor-pointer hover:ring-2 hover:ring-slate-400/50 transition-all' : '',
        className
      )}
      onClick={handleClick}
    >
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
