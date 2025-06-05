
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Video, Mic, Camera } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { UserAvatar } from "@/components/avatar/UserAvatar";
import { AudioRecordingDialog } from "./AudioRecordingDialog";
import { useToast } from "@/hooks/use-toast";

interface CreatePostAreaProps {
  onCreatePost: () => void;
  onGoLive: () => void;
}

export const CreatePostArea = ({ onCreatePost, onGoLive }: CreatePostAreaProps) => {
  const session = useSession();
  const username = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'User';
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAudioRecorded = (audioBlob: Blob) => {
    // For now, just show a success message
    // This could be extended to actually handle the audio upload
    toast({
      title: "Audio Recorded",
      description: "Your audio has been recorded successfully. Audio post creation will be implemented soon.",
    });
    
    console.log("Audio recorded:", audioBlob);
    // TODO: Implement audio post creation logic here
  };

  return (
    <>
      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <UserAvatar 
              userId={session?.user?.id}
              username={username}
              size="md"
            />
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
                onClick={() => setIsAudioDialogOpen(true)}
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

      <AudioRecordingDialog
        open={isAudioDialogOpen}
        onOpenChange={setIsAudioDialogOpen}
        onAudioRecorded={handleAudioRecorded}
      />
    </>
  );
};
