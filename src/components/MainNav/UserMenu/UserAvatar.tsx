import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserAvatarProps {
  avatarUrl?: string;
  email?: string;
}

export const UserAvatar = ({ avatarUrl, email }: UserAvatarProps) => {
  return (
    <Button 
      variant="ghost" 
      className="relative h-10 w-10 rounded-full p-0 hover:bg-muted/50 transition-colors duration-200"
    >
      <Avatar className="h-10 w-10 ring-2 ring-primary/10 transition-all duration-200 hover:ring-primary/20">
        <AvatarImage 
          src={avatarUrl} 
          alt={email || 'User avatar'} 
          className="object-cover"
        />
        <AvatarFallback className="bg-primary/10 text-primary">
          {email?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </Button>
  );
};