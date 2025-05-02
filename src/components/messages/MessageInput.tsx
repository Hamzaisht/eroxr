
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DirectMessage } from '@/integrations/supabase/types/message';
import { 
  Smile, 
  Send, 
  Paperclip, 
  Mic, 
  Camera, 
  X,
  Image
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceRecorder } from './VoiceRecorder';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onMediaSelect?: () => void;
  onSnapStart?: () => void;
  onVoiceMessage?: (audio: Blob) => void;
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
  onTyping,
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const {
    isRecording: voiceIsRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    cancelRecording,
    audioBlob,
  } = useVoiceRecorder();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    if (onTyping) {
      onTyping();
    }
    
    // Auto-resize the textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = useCallback(() => {
    if (message.trim() !== '' && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset the textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [message, onSendMessage, isLoading]);

  // Handle voice recording
  useEffect(() => {
    if (audioBlob && !voiceIsRecording && onVoiceMessage) {
      onVoiceMessage(audioBlob);
    }
  }, [audioBlob, voiceIsRecording, onVoiceMessage]);

  // Start voice recording
  const handleStartRecording = async () => {
    try {
      setIsRecording(true);
      await startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  };

  // Stop voice recording
  const handleStopRecording = () => {
    stopRecording();
    setIsRecording(false);
  };

  // Cancel voice recording
  const handleCancelRecording = () => {
    cancelRecording();
    setIsRecording(false);
  };

  return (
    <div className="p-2 bg-luxury-darker/90 backdrop-blur-sm border-t border-luxury-neutral/10">
      {/* Reply to message */}
      {replyToMessage && (
        <div className="mb-2 px-3 py-2 bg-luxury-neutral/5 rounded-lg border border-luxury-neutral/10 flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-luxury-primary">
              Replying to message
            </div>
            <div className="text-sm truncate text-luxury-neutral/80">
              {replyToMessage.content || "Media message"}
            </div>
          </div>
          {onReplyCancel && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 rounded-full"
              onClick={onReplyCancel}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}

      {/* Voice recording mode */}
      {isRecording ? (
        <VoiceRecorder 
          isRecording={voiceIsRecording}
          duration={recordingDuration}
          onCancel={handleCancelRecording}
          onStop={handleStopRecording}
        />
      ) : (
        <div className="flex items-end gap-2">
          {/* Message input */}
          <div className="flex-1 min-w-0 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className={cn(
                "min-h-[40px] max-h-[120px] py-2.5 pr-10 pl-3 bg-luxury-neutral/5 border-luxury-neutral/10 resize-none",
                "focus:ring-1 focus:ring-luxury-primary/40 focus:border-luxury-primary/40"
              )}
              disabled={isLoading}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 bottom-2 h-6 w-6 p-0 text-luxury-neutral/60 hover:text-luxury-primary/80"
              onClick={() => {/* Add emoji picker toggle functionality */}}
              type="button"
              disabled={isLoading}
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          {/* Media button */}
          {onMediaSelect && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full flex-shrink-0 bg-luxury-neutral/5 hover:bg-luxury-neutral/10"
              onClick={onMediaSelect}
              type="button"
              disabled={isLoading}
            >
              <Image className="h-5 w-5" />
            </Button>
          )}

          {/* Camera button */}
          {onSnapStart && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full flex-shrink-0 bg-luxury-neutral/5 hover:bg-luxury-neutral/10"
              onClick={onSnapStart}
              type="button"
              disabled={isLoading}
            >
              <Camera className="h-5 w-5" />
            </Button>
          )}

          {/* Voice message button */}
          {onVoiceMessage && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full flex-shrink-0 bg-luxury-neutral/5 hover:bg-luxury-neutral/10"
              onClick={handleStartRecording}
              type="button"
              disabled={isLoading}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}

          {/* Send button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full flex-shrink-0",
              message.trim() === '' 
                ? "bg-luxury-neutral/5 text-luxury-neutral/40"
                : "bg-luxury-primary text-white hover:bg-luxury-primary/90"
            )}
            onClick={handleSubmit}
            type="button"
            disabled={isLoading || message.trim() === ''}
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
