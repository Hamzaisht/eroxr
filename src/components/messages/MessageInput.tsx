
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Smile, Paperclip, Camera, Mic, Send } from "lucide-react";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onMediaSelect?: () => void;
  onSnapStart?: () => void;
  onVoiceMessage?: (audioBlob: Blob) => void;
  isLoading?: boolean;
  recipientId?: string;
  replyToMessage?: DirectMessage | null;
  onReplyCancel?: () => void;
  onTyping?: () => void;
}

export const MessageInput = ({
  onSendMessage,
  onMediaSelect,
  onSnapStart,
  onVoiceMessage,
  isLoading = false,
  recipientId,
  replyToMessage,
  onReplyCancel,
  onTyping
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    isRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    cancelRecording,
    audioBlob
  } = useVoiceRecorder();

  // Focus textarea when reply is set
  useEffect(() => {
    if (replyToMessage && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyToMessage]);
  
  // Submit when audio recording completes
  useEffect(() => {
    if (!isRecording && audioBlob && onVoiceMessage) {
      onVoiceMessage(audioBlob);
    }
  }, [isRecording, audioBlob, onVoiceMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Notify that user is typing
    if (onTyping) {
      onTyping();
      
      // Clear existing timer
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      
      // Set new timer
      typingTimerRef.current = setTimeout(() => {
        // Timer has expired, user stopped typing
        typingTimerRef.current = null;
      }, 2000);
    }
  };

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Auto-resize textarea
  const handleTextareaResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleTextareaResize();
  }, [message]);

  return (
    <div className="relative">
      {/* Reply preview */}
      {replyToMessage && (
        <div className="bg-luxury-dark/50 backdrop-blur-sm p-2 mb-2 rounded-md border border-luxury-primary/20 flex items-center justify-between">
          <div className="flex-1 truncate pl-2">
            <span className="text-xs text-luxury-neutral/70">
              Replying to message
            </span>
            <p className="text-sm truncate">
              {replyToMessage.content || "Media message"}
            </p>
          </div>
          {onReplyCancel && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={onReplyCancel}
            >
              <span className="sr-only">Cancel reply</span>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      {/* Voice recording UI */}
      {isRecording && (
        <div className="absolute inset-0 bg-luxury-dark/95 flex items-center justify-between p-3 z-10 rounded-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
            <span className="font-medium">Recording: {recordingDuration}s</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={cancelRecording}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={stopRecording}
            >
              Send
            </Button>
          </div>
        </div>
      )}
      
      <div className={cn(
        "flex items-end gap-2 bg-luxury-darker p-2 rounded-md border border-luxury-neutral/10",
        isLoading && "opacity-70 pointer-events-none"
      )}>
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className={cn(
              "resize-none w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 py-3 px-4 max-h-32",
              isLoading && "cursor-not-allowed"
            )}
            disabled={isLoading || isRecording}
            rows={1}
          />
        </div>

        <div className="flex items-center gap-1 pr-1">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full text-luxury-neutral hover:text-white hover:bg-luxury-neutral/20"
                  onClick={() => {}}
                  disabled={isLoading || isRecording}
                >
                  <Smile className="h-5 w-5" />
                  <span className="sr-only">Emoji</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Emoji</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full text-luxury-neutral hover:text-white hover:bg-luxury-neutral/20"
                  onClick={onMediaSelect}
                  disabled={isLoading || isRecording}
                >
                  <Paperclip className="h-5 w-5" />
                  <span className="sr-only">Attach files</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach files</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full text-luxury-neutral hover:text-white hover:bg-luxury-neutral/20" 
                  onClick={onSnapStart}
                  disabled={isLoading || isRecording}
                >
                  <Camera className="h-5 w-5" />
                  <span className="sr-only">Take photo</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Take photo</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant={isRecording ? "destructive" : "ghost"}
                  className={cn(
                    "h-9 w-9 rounded-full",
                    !isRecording && "text-luxury-neutral hover:text-white hover:bg-luxury-neutral/20",
                    isRecording && "animate-pulse"
                  )}
                  onClick={handleVoiceButtonClick}
                  disabled={isLoading}
                >
                  <Mic className="h-5 w-5" />
                  <span className="sr-only">
                    {isRecording ? "Stop recording" : "Voice message"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {isRecording ? "Stop recording" : "Voice message"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn(
              "h-9 w-9 rounded-full transition-colors",
              message.trim() 
                ? "text-luxury-primary hover:bg-luxury-primary/20" 
                : "text-luxury-neutral/50 cursor-default"
            )}
            onClick={handleSend}
            disabled={!message.trim() || isLoading || isRecording}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
      
      {isLoading && (
        <div className="absolute inset-y-0 right-12 flex items-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-luxury-primary border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;

