
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface PostHeaderProps {
  creator: {
    username?: string | null;
    avatar_url?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export const PostHeader = ({
  creator,
  createdAt,
  updatedAt,
}: PostHeaderProps) => {
  const isEdited = updatedAt && updatedAt !== createdAt;
  const username = creator.username || "Anonymous";

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 ring-2 ring-luxury-primary/20">
        <AvatarImage src={creator.avatar_url || ""} alt={username} />
        <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold text-luxury-neutral">
          {username}
          {isEdited && (
            <span className="ml-2 text-sm text-luxury-neutral/60">(edited)</span>
          )}
        </h3>
        <p className="text-sm text-luxury-neutral/60">
          {format(new Date(createdAt), 'MMM d, yyyy')}
        </p>
      </div>
    </div>
  );
};
