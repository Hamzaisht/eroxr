
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";
import { CreatorInfo } from "./short-content/CreatorInfo";
import { ActionButtons } from "./short-content/ActionButtons";

interface ShortContentProps {
  short: {
    id: string;
    creator: {
      username: string | null;
      avatar_url: string | null;
    };
    description: string;
    likes: number;
    comments: number;
    has_liked: boolean;
    has_saved: boolean;
  };
  onShare: (shortId: string) => void;
  onComment: (shortId: string) => void;
  handleLike: (shortId: string) => Promise<void>;
  handleSave: (shortId: string) => Promise<void>;
  isCurrentVideo: boolean;
  className?: string;
}

export const ShortContent = ({ 
  short,
  onShare,
  onComment,
  handleLike,
  handleSave,
  isCurrentVideo,
  className = ""
}: ShortContentProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className={className}>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-end justify-between"
      >
        <div className={`space-y-4 ${isMobile ? 'max-w-[70%]' : 'max-w-[80%]'}`}>
          <CreatorInfo
            username={short.creator.username}
            avatarUrl={short.creator.avatar_url}
          />
          <p className={`text-white/90 ${isMobile ? 'text-sm' : 'text-base'} leading-relaxed line-clamp-2`}>
            {short.description}
          </p>
        </div>

        <ActionButtons
          shortId={short.id}
          likes={short.likes}
          comments={short.comments}
          hasLiked={short.has_liked}
          hasSaved={short.has_saved}
          onLike={handleLike}
          onComment={onComment}
          onSave={handleSave}
          onShare={onShare}
        />
      </motion.div>
    </div>
  );
};
