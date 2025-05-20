import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { VerifiedMark } from "@/components/shared/VerifiedMark";
import { Heart, MessageSquare, Eye } from "lucide-react";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/utils/media/types";

interface EroboardCardProps {
  post: {
    id: string;
    creator: {
      id: string;
      username: string;
      avatar_url: string;
    };
    content: string;
    description: string;
    media_url: string | null | string[];
    video_url: string | null;
    thumbnail_url: string | null;
    media_type: MediaType;
    likes_count: number;
    comments_count: number;
    view_count: number;
    created_at: string;
  };
}

export const EroboardCard = ({ post }: EroboardCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative rounded-lg overflow-hidden bg-luxury-darker border border-luxury-primary/5 hover:border-luxury-primary/20 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Section */}
      <div className="relative aspect-video w-full">
        <UniversalMedia
          item={{
            url: post.video_url || (post.media_url && Array.isArray(post.media_url) ? post.media_url[0] : post.media_url as string),
            type: post.media_type || MediaType.VIDEO,
            thumbnail: post.thumbnail_url
          }}
          className="w-full h-full object-cover"
          controls={false}
          autoPlay={isHovered}
          loop={true}
          muted={true}
        />
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        {/* Header with Avatar and Username */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.creator.avatar_url} alt={post.creator.username} />
            <AvatarFallback>{post.creator.username.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <Link to={`/user/${post.creator.id}`} className="flex items-center gap-1 text-sm font-medium hover:underline">
            {post.creator.username}
            <VerifiedMark size="sm" />
          </Link>
        </div>
        
        {/* Post Description */}
        <p className="text-sm text-luxury-neutral line-clamp-2">{post.description || post.content}</p>
        
        {/* Footer with Stats */}
        <div className="flex items-center justify-between mt-3 text-xs text-luxury-neutral/80">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 hover:text-luxury-primary transition-colors">
              <Heart className="h-3.5 w-3.5" />
              <span>{post.likes_count}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-luxury-primary transition-colors">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{post.comments_count}</span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{post.view_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
