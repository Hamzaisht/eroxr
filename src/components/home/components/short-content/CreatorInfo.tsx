
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/hooks/use-mobile";

interface CreatorInfoProps {
  username: string | null;
  avatarUrl: string | null;
}

export const CreatorInfo = ({ username, avatarUrl }: CreatorInfoProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex items-center gap-3">
      <Avatar className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} ring-2 ring-white/20`}>
        <AvatarImage src={avatarUrl ?? ""} />
        <AvatarFallback>
          {username?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">
            @{username}
          </span>
          <Badge variant="secondary" className="bg-luxury-primary/20 text-luxury-primary">
            Creator
          </Badge>
        </div>
        <span className="text-sm text-white/60">
          {new Date().toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};
