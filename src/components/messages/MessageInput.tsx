import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Image, Camera, Smile } from "lucide-react";
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
      <form onSubmit={handleSubmit} className="p-3 border-t border-luxury-neutral/10 bg-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="hover:bg-luxury-neutral/10 text-luxury-neutral/70"
            onClick={onSnapStart}
          >
            <Camera className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="hover:bg-luxury-neutral/10 text-luxury-neutral/70"
            onClick={() => setIsMediaDialogOpen(true)}
          >
            <Image className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send a chat"
              className="pr-10 bg-white/5 border-luxury-neutral/20 text-luxury-neutral placeholder:text-luxury-neutral/50"
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent text-luxury-neutral/50"
            >
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          <Button 
            type="submit" 
            size="icon"
            className="bg-[#0B84FF] hover:bg-[#0B84FF]/90"
            disabled={!message.trim()}
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