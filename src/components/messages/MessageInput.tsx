import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Video, Camera } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
}

export const MessageInput = ({ 
  onSendMessage, 
  onStartRecording, 
  onStopRecording, 
  isRecording 
}: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
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
          {isRecording ? (
            <Camera className="h-4 w-4 animate-pulse" />
          ) : (
            <Video className="h-4 w-4" />
          )}
        </Button>
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};