
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShortsVideo {
  id: string;
  title: string;
  creator: {
    username: string;
    isVerified: boolean;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
}

export const ShortsFeed = () => {
  const [videos] = useState<ShortsVideo[]>([
    {
      id: '1',
      title: 'Amazing content',
      creator: { username: 'creator1', isVerified: true },
      likes: 1250,
      comments: 89,
      isLiked: false
    }
  ]);
  const { toast } = useToast();

  const handleLike = (videoId: string) => {
    toast({
      title: "Coming soon",
      description: "Video interactions will be available soon"
    });
  };

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <Card key={video.id} className="relative aspect-[9/16] max-w-sm mx-auto overflow-hidden">
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <Play className="w-16 h-16 text-white/60" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h3 className="font-semibold mb-2">{video.title}</h3>
            <p className="text-sm opacity-90">@{video.creator.username}</p>
            
            <div className="flex items-center gap-4 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(video.id)}
                className="text-white hover:text-red-500"
              >
                <Heart className="w-5 h-5 mr-1" />
                {video.likes}
              </Button>
              
              <Button variant="ghost" size="sm" className="text-white">
                <MessageCircle className="w-5 h-5 mr-1" />
                {video.comments}
              </Button>
              
              <Button variant="ghost" size="sm" className="text-white">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
