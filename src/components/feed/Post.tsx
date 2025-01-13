import { Post as PostType } from "./types";
import { User } from "@supabase/auth-helpers-react";
import { Creator } from "@/integrations/supabase/types/profile";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostProps {
  post: PostType;
  creator: Creator;
  currentUser: User | null;
}

export const Post = ({ post, creator, currentUser }: PostProps) => {
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
          </div>
          <p className="mt-2 text-sm text-luxury-neutral/80">{post.content}</p>
          {post.media_url && post.media_url.length > 0 && (
            <div className="mt-4 space-y-2">
              {post.media_url.map((url, index) => (
                <img 
                  key={index}
                  src={url}
                  alt={`Post media ${index + 1}`}
                  className="rounded-lg max-h-96 w-full object-cover"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};