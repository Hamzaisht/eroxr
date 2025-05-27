
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Video, Mic, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@supabase/auth-helpers-react";
import { useUserAvatar } from "@/hooks/useUserAvatar";

interface CreatePostAreaProps {
  onCreatePost: () => void;
  onGoLive: () => void;
}

export const CreatePostArea = ({ onCreatePost, onGoLive }: CreatePostAreaProps) => {
  const session = useSession();
  const { avatar } = useUserAvatar(session?.user?.id);
  const username = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'User';

  return (
    <Card className="bg-luxury-darker border-luxury-neutral/10">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar?.url || ""} alt={username} />
            <AvatarFallback className="bg-luxury-darker text-luxury-neutral">
              {username[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            className="flex-1 justify-start text-luxury-neutral/60 hover:text-luxury-neutral"
            onClick={onCreatePost}
          >
            What's on your mind?
          </Button>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-luxury-neutral/10">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-luxury-neutral/60 hover:text-luxury-neutral"
              onClick={onCreatePost}
            >
              <Image className="h-4 w-4 mr-2" />
              Photo
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-luxury-neutral/60 hover:text-luxury-neutral"
              onClick={onCreatePost}
            >
              <Video className="h-4 w-4 mr-2" />
              Video
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-luxury-neutral/60 hover:text-luxury-neutral"
              onClick={onCreatePost}
            >
              <Mic className="h-4 w-4 mr-2" />
              Audio
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-luxury-primary hover:text-luxury-primary/80"
            onClick={onGoLive}
          >
            <Camera className="h-4 w-4 mr-2" />
            Go Live
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
