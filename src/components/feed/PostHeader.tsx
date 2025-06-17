
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostManagementActions } from "./PostManagementActions";
import { useAuth } from "@/contexts/AuthContext";

interface PostHeaderProps {
  creator: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  createdAt: string;
  postId: string;
  visibility: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PostHeader = ({ 
  creator, 
  createdAt, 
  postId, 
  visibility,
  onEdit,
  onDelete 
}: PostHeaderProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === creator.id;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={creator.avatar_url} />
          <AvatarFallback>
            {creator.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{creator.username}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      
      <PostManagementActions
        postId={postId}
        isOwner={isOwner}
        visibility={visibility}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};
