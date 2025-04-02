
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SessionAvatarProps {
  avatarUrl?: string | null;
  username?: string;
}

export const SessionAvatar = ({ avatarUrl, username }: SessionAvatarProps) => {
  // Helper function to get first character for avatar fallback
  const getInitial = (name: string | undefined) => {
    return (name || 'Unknown')?.[0]?.toUpperCase() || '?';
  };

  return (
    <Avatar className="h-10 w-10 border border-white/10">
      <AvatarImage src={avatarUrl || undefined} alt={username || 'Unknown'} />
      <AvatarFallback>{getInitial(username)}</AvatarFallback>
    </Avatar>
  );
};
