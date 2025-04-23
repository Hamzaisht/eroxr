
import { Button } from "@/components/ui/button";
import { Send, Mic } from "lucide-react";

interface MessageControlsProps {
  message: string;
  isLoading?: boolean;
  onSend: () => void;
  onVoiceStart: () => void;
}

export const MessageControls = ({ message, isLoading, onSend, onVoiceStart }: MessageControlsProps) => {
  return message.trim() ? (
    <Button 
      onClick={onSend}
      disabled={!message.trim() || isLoading}
      variant={message.trim() ? "default" : "ghost"}
      size="icon"
      className="h-9 w-9 rounded-full"
      aria-label="Send message"
    >
      <Send className="h-5 w-5" />
    </Button>
  ) : (
    <Button 
      onClick={onVoiceStart}
      disabled={isLoading}
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-full"
      aria-label="Record voice message"
    >
      <Mic className="h-5 w-5" />
    </Button>
  );
};
