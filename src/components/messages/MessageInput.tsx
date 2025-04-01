
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Image as ImageIcon, Smile, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useGhostMode } from "@/hooks/useGhostMode";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onMediaSelect: (files: FileList) => void;
  onSnapStart: () => void;
  isLoading?: boolean;
  recipientId: string;
}

export const MessageInput = ({ 
  onSendMessage, 
  onMediaSelect, 
  onSnapStart,
  isLoading,
  recipientId
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const session = useSession();
  const { isGhostMode } = useGhostMode();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !isLoading) return;
    
    await onSendMessage(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Skip typing indicators in ghost mode
    if (isGhostMode) return;
    
    // If the user wasn't already typing, broadcast that they are typing
    if (!isUserTyping) {
      broadcastTypingStatus(true);
      setIsUserTyping(true);
    }
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set a new timeout to stop typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      broadcastTypingStatus(false);
      setIsUserTyping(false);
    }, 2000);
  };

  const broadcastTypingStatus = async (isTyping: boolean) => {
    if (!session?.user?.id) return;
    
    try {
      await supabase.channel('typing-status').send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          user_id: session.user.id,
          recipient_id: recipientId,
          is_typing: isTyping
        }
      });
    } catch (error) {
      console.error('Error broadcasting typing status:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onMediaSelect(e.target.files);
      e.target.value = ""; // Reset input
    }
  };

  useEffect(() => {
    return () => {
      // Clean up typing status when component unmounts
      if (isUserTyping && !isGhostMode) {
        broadcastTypingStatus(false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isUserTyping]);

  return (
    <form onSubmit={handleSubmit} className="bg-[#161B22] border-t border-white/5 p-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-luxury-neutral/60 hover:text-luxury-neutral"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-luxury-neutral/60 hover:text-luxury-neutral"
          onClick={onSnapStart}
        >
          <Camera className="h-5 w-5" />
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*"
          multiple
        />
        
        <Input
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-[#0D1117] border-white/5 focus-visible:ring-0 focus-visible:ring-offset-0 text-white/90"
        />
        
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !message.trim()}
          className={`${isLoading ? 'opacity-50' : 'opacity-100'}`}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
