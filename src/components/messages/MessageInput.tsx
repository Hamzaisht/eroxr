
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";
import { SnapButton } from "./SnapButton";
import { useTypingIndicator, useMessageAudit } from "@/hooks";
import { MediaViewer } from "@/components/media/MediaViewer";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
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
  const [isComposing, setIsComposing] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { sendTypingStatus } = useTypingIndicator(recipientId, undefined);
  const { logMessageActivity } = useMessageAudit(undefined, undefined);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      // Log message send attempt
      logMessageActivity('send_attempt', { 
        content: message.trim(),
        recipient_id: recipientId,
        message_type: 'text'
      });
      
      onSendMessage(message.trim());
      setMessage("");
      
      // Clear typing status when message is sent
      sendTypingStatus(false, recipientId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Send typing indicator
    if (value.length > 0) {
      sendTypingStatus(true, recipientId);
      
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop the typing indicator after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingStatus(false, recipientId);
      }, 3000);
    } else {
      sendTypingStatus(false, recipientId);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Log media upload attempt
      logMessageActivity('media_upload', {
        recipient_id: recipientId,
        file_count: e.target.files.length,
        file_types: Array.from(e.target.files).map(file => file.type)
      });
      
      onMediaSelect(e.target.files);
      
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleMediaClick = (url: string) => {
    setSelectedMedia(url);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  useEffect(() => {
    // Clean up typing indicator on component unmount
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        sendTypingStatus(false, recipientId);
      }
    };
  }, [recipientId]);

  return (
    <>
      <div className="flex items-center gap-2 p-2 border-t border-luxury-neutral/10 bg-luxury-dark-secondary">
        <SnapButton onCaptureStart={onSnapStart} />
        
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
          multiple
        />
        
        <Button 
          variant="ghost" 
          size="icon" 
          type="button"
          className="h-9 w-9 rounded-full"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5 text-luxury-neutral" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            ref={inputRef}
            className="bg-luxury-neutral/5 border-luxury-neutral/20 text-luxury-text"
            disabled={isLoading}
            aria-label="Message input"
          />
        </div>
        
        <Button 
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          variant={message.trim() ? "default" : "ghost"}
          size="icon"
          className="h-9 w-9 rounded-full"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {/* Media Viewer for enlarged media */}
      <MediaViewer 
        media={selectedMedia} 
        onClose={() => setSelectedMedia(null)}
      />
    </>
  );
};
