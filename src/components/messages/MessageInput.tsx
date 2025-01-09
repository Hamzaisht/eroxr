import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaDialog } from "./MediaDialog";
import { SnapButton } from "./SnapButton";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <SnapButton 
            onSnapStart={onSnapStart}
            onSnapEnd={onSnapEnd}
          />
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
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <MediaDialog
        isOpen={isMediaDialogOpen}
        onClose={() => setIsMediaDialogOpen(false)}
        onMediaSelect={onMediaSelect}
      />
    </>
  );
};