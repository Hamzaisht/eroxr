import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Video, Camera, Image } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  onMediaSelect: (files: FileList) => void;
  onSnapStart: () => void;
  onSnapEnd: () => void;
}

export const MessageInput = ({ 
  onSendMessage, 
  onStartRecording, 
  onStopRecording, 
  isRecording,
  onMediaSelect,
  onSnapStart,
  onSnapEnd
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const snapTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onMediaSelect(e.target.files);
      setIsMediaDialogOpen(false);
    }
  };

  const handleSnapPress = () => {
    onSnapStart();
    snapTimeoutRef.current = setTimeout(() => {
      onSnapEnd();
      toast({
        title: "Video mode",
        description: "Hold to record video, release to stop",
      });
    }, 30);
  };

  const handleSnapRelease = () => {
    if (snapTimeoutRef.current) {
      clearTimeout(snapTimeoutRef.current);
      onSnapEnd();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="hover:bg-muted"
            onMouseDown={handleSnapPress}
            onMouseUp={handleSnapRelease}
            onTouchStart={handleSnapPress}
            onTouchEnd={handleSnapRelease}
          >
            <Camera className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="hover:bg-muted"
            onClick={() => setIsMediaDialogOpen(true)}
          >
            <Image className="h-4 w-4" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            type="button"
            size="icon"
            variant={isRecording ? "destructive" : "secondary"}
            onClick={isRecording ? onStopRecording : onStartRecording}
          >
            <Video className={cn("h-4 w-4", isRecording && "animate-pulse")} />
          </Button>
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="grid gap-4">
            <div className="flex flex-col items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleMediaSelect}
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                Choose Files
              </Button>
              <p className="text-sm text-muted-foreground">
                Select photos or videos to share
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};