import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserAvatarProps {
  avatarUrl?: string;
  email?: string;
}

export const UserAvatar = ({ avatarUrl, email }: UserAvatarProps) => {
  return (
    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} alt={email} />
        <AvatarFallback className="bg-primary/10">
          {email?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </Button>
  );
};