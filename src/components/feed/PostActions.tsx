import { LikeButton } from "./post-actions/LikeButton";
import { ShareButton } from "./post-actions/ShareButton";
import { SaveButton } from "./post-actions/SaveButton";
import { CommentSection } from "./CommentSection";

interface PostActionsProps {
  postId: string;
  likesCount: number | null;
  commentsCount: number | null;
  hasLiked: boolean;
  onLike: (postId: string) => Promise<void>;
}

export const PostActions = ({ 
  postId, 
  likesCount, 
  commentsCount, 
  hasLiked, 
  onLike 
}: PostActionsProps) => {
  return (
    <div className="flex gap-4">
      <LikeButton
        postId={postId}
        likesCount={likesCount}
        hasLiked={hasLiked}
        onLike={onLike}
      />
      
      <CommentSection postId={postId} commentsCount={commentsCount} />
      
      <ShareButton />
      
      <SaveButton postId={postId} />
    </div>
  );
};