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
import { VideoPlayer } from "../video/VideoPlayer";

interface PostProps {
  post: PostType;
  creator: Creator;
  currentUser: User | null;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export const Post = ({ 
  post, 
  creator, 
  currentUser, 
  onEdit, 
  onDelete 
}: PostProps) => {
  const isOwner = currentUser?.id === creator.id;
  const hasAccess = !post.is_ppv || post.has_purchased || isOwner;

  const handleEdit = () => {
    if (onEdit) onEdit(post.id);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(post.id);
  };

  return (
    <Card className="p-4 bg-luxury-dark/30 border-luxury-neutral/10">
      <div className="flex items-start space-x-4">
        <Avatar>
          <AvatarImage src={creator.avatar_url || ''} alt={creator.username || ''} />
          <AvatarFallback>{creator.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{creator.username}</h3>
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
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
          <p className="mt-2 text-sm text-luxury-neutral/80">{post.content}</p>
          
          {/* Handle PPV Content */}
          {post.is_ppv && !hasAccess ? (
            <PPVContent 
              postId={post.id} 
              amount={post.ppv_amount || 0}
              mediaUrl={post.media_url?.[0]}
            />
          ) : (
            <div className="mt-4 space-y-4">
              {/* Video Content */}
              {post.video_urls && post.video_urls.length > 0 && (
                <div className="space-y-4">
                  {post.video_urls.map((url, index) => (
                    <VideoPlayer
                      key={`video-${index}`}
                      url={url}
                      className="w-full rounded-lg overflow-hidden"
                      poster={post.media_url?.[0]}
                    />
                  ))}
                </div>
              )}
              
              {/* Image Content */}
              {post.media_url && post.media_url.length > 0 && (
                <div className="space-y-2">
                  {post.media_url.map((url, index) => (
                    <img 
                      key={`image-${index}`}
                      src={url}
                      alt={`Post media ${index + 1}`}
                      className="rounded-lg max-h-96 w-full object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};