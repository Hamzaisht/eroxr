
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface StoryItemProps {
  story: {
    id: string;
    creator: {
      id: string;
      username: string;
      avatar_url?: string;
    };
    created_at: string;
    expires_at: string;
    media_url?: string;
  };
  onClick?: () => void;
}

export const StoryItem = ({ story, onClick }: StoryItemProps) => {
  const isExpired = new Date(story.expires_at) < new Date();

  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer aspect-[9/16] ${
        isExpired ? 'opacity-50' : ''
      }`}
      onClick={onClick}
    >
      {story.media_url ? (
        <img 
          src={story.media_url} 
          alt="Story"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-b from-purple-500 to-pink-500" />
      )}
      
      <div className="absolute top-2 left-2">
        <Avatar className="h-8 w-8 border-2 border-white">
          <AvatarImage src={story.creator.avatar_url} />
          <AvatarFallback>
            {story.creator.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="absolute bottom-2 left-2 right-2">
        <p className="text-white text-sm font-medium">
          {story.creator.username}
        </p>
        <p className="text-white text-xs opacity-75">
          {formatDistanceToNow(new Date(story.created_at), { addSuffix: true })}
        </p>
      </div>
    </Card>
  );
};
