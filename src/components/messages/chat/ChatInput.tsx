
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onTyping?: () => void;
}

export const ChatInput = ({ onSendMessage, onTyping }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (onTyping && e.target.value.length > 0) {
      onTyping();
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 border-t border-luxury-neutral/10 bg-luxury-darker">
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className="bg-luxury-neutral/5 border-luxury-neutral/20 text-luxury-text"
        />
      </div>
      
      <Button 
        onClick={handleSend}
        disabled={!message.trim()}
        variant={message.trim() ? "default" : "ghost"}
        size="icon"
        className="h-9 w-9 rounded-full"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};
