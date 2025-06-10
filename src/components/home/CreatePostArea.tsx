
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Video, Mic, Camera, UserPlus } from "lucide-react";
import { UserAvatar } from "@/components/avatar/UserAvatar";
import { AudioRecordingDialog } from "./AudioRecordingDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface CreatePostAreaProps {
  onCreatePost: () => void;
  onGoLive: () => void;
}

export const CreatePostArea = ({ onCreatePost, onGoLive }: CreatePostAreaProps) => {
  const { user, session } = useAuth();
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const isLoggedIn = !!user && !!session;

  const handleAudioRecorded = (audioBlob: Blob) => {
    if (!isLoggedIn) {
      handleAuthRequired();
      return;
    }
    
    toast({
      title: "Audio Recorded",
      description: "Your audio has been recorded successfully. Audio post creation will be implemented soon.",
    });
    
    console.log("Audio recorded:", audioBlob);
  };

  const handleAuthRequired = () => {
    toast({
      title: "Sign in required",
      description: "Please sign in to create posts and interact with content.",
      variant: "destructive",
    });
    navigate('/login');
  };

  const handleCreatePost = () => {
    if (!isLoggedIn) {
      handleAuthRequired();
      return;
    }
    onCreatePost();
  };

  const handleGoLive = () => {
    if (!isLoggedIn) {
      handleAuthRequired();
      return;
    }
    onGoLive();
  };

  const handleAudioAction = () => {
    if (!isLoggedIn) {
      handleAuthRequired();
      return;
    }
    setIsAudioDialogOpen(true);
  };

  if (!isLoggedIn) {
    return (
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardContent className="p-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-luxury-neutral/20 flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-luxury-neutral/60" />
              </div>
            </div>
            <div>
              <p className="text-luxury-neutral/80 mb-2">Join the conversation</p>
              <Button
                onClick={handleAuthRequired}
                className="bg-luxury-primary hover:bg-luxury-primary/90 text-white"
              >
                Sign Up to Post
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <UserAvatar 
              userId={user?.id}
              username={username}
              size="md"
            />
            <Button
              variant="ghost"
              className="flex-1 justify-start text-luxury-neutral/60 hover:text-luxury-neutral"
              onClick={handleCreatePost}
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
                onClick={handleCreatePost}
              >
                <Image className="h-4 w-4 mr-2" />
                Photo
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-luxury-neutral/60 hover:text-luxury-neutral"
                onClick={handleCreatePost}
              >
                <Video className="h-4 w-4 mr-2" />
                Video
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-luxury-neutral/60 hover:text-luxury-neutral"
                onClick={handleAudioAction}
              >
                <Mic className="h-4 w-4 mr-2" />
                Audio
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-luxury-primary hover:text-luxury-primary/80"
              onClick={handleGoLive}
            >
              <Camera className="h-4 w-4 mr-2" />
              Go Live
            </Button>
          </div>
        </CardContent>
      </Card>

      <AudioRecordingDialog
        open={isAudioDialogOpen}
        onOpenChange={setIsAudioDialogOpen}
        onAudioRecorded={handleAudioRecorded}
      />
    </>
  );
};
