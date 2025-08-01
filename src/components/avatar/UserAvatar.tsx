
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OptimizedAvatar } from "@/components/ui/OptimizedImage";
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
  priority?: boolean; // For above-the-fold avatars
}

export const UserAvatar = ({ 
  userId, 
  username, 
  email,
  size = 'md',
  className = "",
  fallbackClassName = "",
  clickable = true,
  priority = false
}: UserAvatarProps) => {
  const { avatar, isLoading } = useUserAvatar(userId);
  const navigate = useNavigate();

  const handleClick = () => {
    if (clickable && userId) {
      navigate(`/new-profile/${userId}`);
    }
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
    <div
      className={cn(
        getSizeClass(), 
        clickable && userId ? 'cursor-pointer hover:ring-2 hover:ring-slate-400/50 transition-all' : '',
        className
      )}
      onClick={handleClick}
    >
      <OptimizedAvatar
        src={avatar?.url}
        userId={userId || undefined}
        username={username || avatar?.username || email?.split('@')[0] || undefined}
        size={size}
        priority={priority}
        className="w-full h-full"
      />
    </div>
  );
};
