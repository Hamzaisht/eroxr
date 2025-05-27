
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, VideoIcon, MicIcon, MapPinIcon } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";

interface CreatePostAreaProps {
  onCreatePost: () => void;
  onGoLive?: () => void;
}

export const CreatePostArea = ({ onCreatePost, onGoLive }: CreatePostAreaProps) => {
  const session = useSession();

  return (
    <Card className="bg-luxury-darker border-luxury-neutral/10 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {session?.user?.email?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-left text-gray-400 bg-luxury-neutral/5 hover:bg-luxury-neutral/10"
              onClick={onCreatePost}
            >
              What's on your mind?
            </Button>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-luxury-neutral/10">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <VideoIcon className="h-4 w-4 mr-2" />
                  Video
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MicIcon className="h-4 w-4 mr-2" />
                  Audio
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  Location
                </Button>
              </div>
              
              {onGoLive && (
                <Button 
                  onClick={onGoLive}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                >
                  Go Live
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
