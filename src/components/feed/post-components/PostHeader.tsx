import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostHeaderProps {
  creator: {
    username: string | null;
    avatar_url: string | null;
  };
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const PostHeader = ({
  creator,
  createdAt,
  updatedAt,
  isOwner,
  onEdit,
  onDelete,
}: PostHeaderProps) => {
  const isEdited = updatedAt && updatedAt !== createdAt;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-2 ring-luxury-primary/20">
          <AvatarImage src={creator.avatar_url || ""} alt={creator.username || "User"} />
          <AvatarFallback>{creator.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-luxury-neutral">
            {creator.username}
            {isEdited && (
              <span className="ml-2 text-sm text-luxury-neutral/60">(edited)</span>
            )}
          </h3>
          <p className="text-sm text-luxury-neutral/60">
            {format(new Date(createdAt), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      {isOwner && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Post
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-500"
              onClick={onDelete}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};