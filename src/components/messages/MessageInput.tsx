
import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Camera, 
  PaperclipIcon, 
  Smile, 
  Mic, 
  X,
  Video,
  StopCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EmojiPickerSimple } from './EmojiPickerSimple';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onMediaSelect: () => void;
  onSnapStart: () => void;
  onVoiceMessage: (audioBlob: Blob) => void;
  onBookCall?: () => void;
  isLoading?: boolean;
  recipientId: string;
  replyToMessage?: DirectMessage | null;
  onReplyCancel?: () => void;
  onTyping?: () => void;
}

export const MessageInput = ({
  onSendMessage,
  onMediaSelect,
  onSnapStart,
  onVoiceMessage,
  onBookCall,
  isLoading = false,
  recipientId,
  replyToMessage,
  onReplyCancel,
  onTyping
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    startRecording,
    stopRecording,
    isRecordingAudio,
    audioBlob,
    recordingTime,
    clearRecording
  } = useVoiceRecorder();
  
  useEffect(() => {
    if (audioBlob && !isRecordingAudio) {
      onVoiceMessage(audioBlob);
      clearRecording();
    }
  }, [audioBlob, isRecordingAudio, onVoiceMessage, clearRecording]);
  
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      
      // Focus input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Send typing indicator
    if (onTyping) {
      onTyping();
      
      // Clear existing timeout and set new one
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        typingTimeoutRef.current = null;
      }, 2000);
    }
  };
  
  const handleEmojiSelect = (emoji: { native: string }) => {
    setMessage(prev => prev + emoji.native);
    inputRef.current?.focus();
    
    // Also trigger typing indicator
    if (onTyping) onTyping();
  };
  
  const handleRecord = () => {
    if (isRecordingAudio) {
      stopRecording();
      setIsRecording(false);
    } else {
      startRecording();
      setIsRecording(true);
    }
  };
  
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      {/* Reply UI */}
      {replyToMessage && (
        <div className="bg-luxury-neutral/10 rounded-t-lg p-2 mb-0.5 flex items-center">
          <div className="flex-1 overflow-hidden text-sm text-luxury-neutral/80">
            <span className="font-medium text-luxury-primary/90 mr-1">Reply to:</span>
            <span className="truncate">
              {replyToMessage.content || (replyToMessage.media_url ? "Media message" : "Message")}
            </span>
          </div>
          {onReplyCancel && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full"
              onClick={onReplyCancel}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
      
      {/* Recording UI */}
      {isRecording && (
        <div className="bg-red-900/20 rounded-lg p-3 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="animate-pulse">
              <Mic className="h-5 w-5 text-red-400" />
            </div>
            <span className="text-sm text-red-300">
              Recording {formatRecordingTime(recordingTime)}
            </span>
          </div>
          <Button 
            type="button"
            size="sm"
            variant="destructive"
            className="h-8 px-2"
            onClick={() => {
              stopRecording();
              setIsRecording(false);
            }}
          >
            <StopCircle className="h-4 w-4 mr-1" />
            Stop
          </Button>
        </div>
      )}
      
      <div className={cn(
        "flex items-center gap-1 bg-luxury-neutral/10 rounded-lg",
        replyToMessage && "rounded-t-none"
      )}>
        <div className="flex items-center gap-1 p-1 pl-2">
          {/* Emoji picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
              >
                <Smile className="h-4 w-4 text-luxury-neutral/70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              side="top" 
              sideOffset={10}
              className="p-0 border-luxury-neutral/20 bg-luxury-darker w-auto"
            >
              <EmojiPickerSimple onEmojiSelect={handleEmojiSelect} />
            </PopoverContent>
          </Popover>
          
          {/* Media selection button */}
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={onMediaSelect}
            disabled={isLoading}
          >
            <PaperclipIcon className="h-4 w-4 text-luxury-neutral/70" />
          </Button>
          
          {/* Snap camera button */}
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={onSnapStart}
            disabled={isLoading}
          >
            <Camera className="h-4 w-4 text-luxury-neutral/70" />
          </Button>
        </div>
        
        {/* Message input - Added text-white class here */}
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-transparent resize-none p-3 outline-none text-sm text-white"
          rows={1}
          disabled={isLoading || isRecording}
        />
        
        <div className="flex items-center p-1">
          {message.trim() ? (
            <Button 
              type="submit" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-luxury-primary"
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <>
              {/* Record voice message button */}
              <Button 
                type="button"
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={handleRecord}
                disabled={isLoading}
              >
                <Mic className={cn(
                  "h-4 w-4", 
                  isRecording ? "text-red-400" : "text-luxury-neutral/70"
                )} />
              </Button>
              
              {/* Video call button */}
              {onBookCall && (
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={onBookCall}
                  disabled={isLoading}
                >
                  <Video className="h-4 w-4 text-luxury-primary/70" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </form>
  );
};

