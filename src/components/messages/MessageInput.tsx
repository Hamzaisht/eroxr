import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Image, Camera } from "lucide-react";
import { MediaDialog } from "./MediaDialog";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onMediaSelect: (files: FileList) => void;
  onSnapStart: () => void;
}

export const MessageInput = ({ 
  onSendMessage, 
  onMediaSelect,
  onSnapStart
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
      <form onSubmit={handleSubmit} className="p-4 border-t border-luxury-neutral/10 bg-white/5 backdrop-blur-sm">
        <div className="flex gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="hover:bg-luxury-neutral/10 text-luxury-neutral/70 hover:text-luxury-primary transition-colors"
            onClick={onSnapStart}
          >
            <Camera className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="hover:bg-luxury-neutral/10 text-luxury-neutral/70 hover:text-luxury-primary transition-colors"
            onClick={() => setIsMediaDialogOpen(true)}
          >
            <Image className="h-4 w-4" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a chat"
            className="flex-1 bg-white/5 border-luxury-neutral/20 text-luxury-neutral placeholder:text-luxury-neutral/50"
          />
          <Button 
            type="submit" 
            size="icon"
            className="bg-luxury-primary hover:bg-luxury-primary/90"
          >
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