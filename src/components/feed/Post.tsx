
import { useState } from "react";
import { motion } from "framer-motion";
import { PostHeader } from "./post-components/PostHeader";
import { PostContent } from "./post-components/PostContent";
import { PostActions } from "./post-components/PostActions";
import { PostComments } from "./post-components/PostComments";
import { PostStats } from "./post-components/PostStats";
import { usePostActions } from "@/hooks/usePostActions";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";

interface PostProps {
  id: string;
  content: string;
  creatorId: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  creator: {
    username: string;
    avatarUrl?: string;
    isVerified?: boolean;
  };
  isLiked?: boolean;
  isSaved?: boolean;
  showComments?: boolean;
  className?: string;
}

export const Post = ({
  id,
  content,
  creatorId,
  createdAt,
  likesCount,
  commentsCount,
  sharesCount,
  creator,
  isLiked = false,
  isSaved = false,
  showComments = true,
  className
}: PostProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCommentsSection, setShowCommentsSection] = useState(false);
  
  const {
    handleLike,
    handleSave,
    handleShare,
    handleComment
  } = usePostActions(id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="bg-luxury-darker border-luxury-neutral/20 p-6">
        <PostHeader
          creator={creator}
          createdAt={formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          postId={id}
          creatorId={creatorId}
        />

        <PostContent
          content={content}
          creatorId={creatorId}
        />

        <PostStats
          likesCount={likesCount}
          commentsCount={commentsCount}
          sharesCount={sharesCount}
        />

        <PostActions
          postId={id}
          isLiked={isLiked}
          isSaved={isSaved}
          onLike={handleLike}
          onComment={() => setShowCommentsSection(!showCommentsSection)}
          onShare={handleShare}
          onSave={handleSave}
        />

        {showComments && showCommentsSection && (
          <PostComments postId={id} />
        )}
      </Card>
    </motion.div>
  );
};
