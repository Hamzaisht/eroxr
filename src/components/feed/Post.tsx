
import { Post as PostType } from "./types";
import { User } from "@supabase/auth-helpers-react";
import { Creator } from "@/integrations/supabase/types/profile";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PPVContent } from "./PPVContent";
import { UniversalMedia } from "@/components/media/UniversalMedia";
import { MediaType } from "@/types/media";

interface PostProps {
  post: PostType;
  creator: Creator;
  currentUser: User | null;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onLike?: (postId: string) => void;
}

export const Post = ({ 
  post, 
  creator, 
  currentUser, 
  onEdit, 
  onDelete,
  onLike 
}: PostProps) => {
  const isOwner = currentUser?.id === creator.id;
  const hasAccess = !post.is_ppv || (post.has_purchased ?? false) || isOwner;

  const handleEdit = () => {
    if (onEdit) onEdit(post.id);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(post.id);
  };

  const handleLike = () => {
    if (onLike) onLike(post.id);
  };

  return (
    <Card className="bg-luxury-dark/30 border-luxury-neutral/10 overflow-hidden">
      <div className="p-3 md:p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={creator.avatar_url || ''} alt={creator.username || ''} />
            <AvatarFallback>{creator.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate">{creator.username || 'Anonymous'}</h3>
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={handleDelete}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <p className="mt-1 text-sm text-luxury-neutral/80 break-words">{post.content}</p>
          </div>
        </div>
        
        {/* Handle PPV Content */}
        {post.is_ppv && !hasAccess ? (
          <div className="mt-3">
            <PPVContent 
              postId={post.id} 
              amount={post.ppv_amount || 0}
              mediaUrl={post.media_url?.[0]}
            />
          </div>
        ) : (
          <div className="mt-3 -mx-3 md:-mx-4 space-y-3">
            {/* Video Content */}
            {post.video_urls && post.video_urls.length > 0 && (
              <div className="space-y-3">
                {post.video_urls.map((url, index) => (
                  <UniversalMedia
                    key={`video-${index}`}
                    item={{
                      url: url,
                      type: MediaType.VIDEO,
                      creator_id: creator.id,
                      thumbnail: post.media_url?.[0]
                    }}
                    className="w-full aspect-[4/3] sm:aspect-[16/9]"
                  />
                ))}
              </div>
            )}
            
            {/* Image Content */}
            {post.media_url && post.media_url.length > 0 && (
              <div className="space-y-3">
                {post.media_url.map((url, index) => (
                  <UniversalMedia
                    key={`image-${index}`}
                    item={{
                      url: url,
                      type: MediaType.IMAGE,
                      creator_id: creator.id
                    }}
                    className="w-full object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Post Interactions */}
        
      </div>
    </Card>
  );
};
