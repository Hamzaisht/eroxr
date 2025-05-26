
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";

interface ChatInputProps {
  recipientId: string;
  onSendMessage: (content: string) => void;
}

export const ChatInput = ({ recipientId, onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { 
    isUploading,
    handleMediaSelect,
    handleSnapCapture
  } = useMessages();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
        disabled={isUploading}
      />
      <Button type="submit" size="icon" disabled={!message.trim() || isUploading}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
