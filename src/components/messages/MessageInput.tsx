
import React, { useState, useRef } from 'react';
import { Smile, X } from "lucide-react"; // Added X import
import { Button } from "@/components/ui/button";
import { AttachmentButton } from './message-parts/AttachmentButton';
import { MessageControls } from './message-parts/MessageControls';
import { EmojiPicker } from './message-parts/EmojiPicker'; // Updated path
import { DirectMessage } from '@/integrations/supabase/types/message';

// Create a simple implementation of VoiceRecorder
import { VoiceRecorder } from './VoiceRecorder';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onMediaSelect?: () => void;
  onSnapStart?: () => void;
  onVoiceMessage?: (audioBlob: Blob) => void;
  isLoading?: boolean;
  recipientId: string;
  replyToMessage?: DirectMessage | null;
  onReplyCancel?: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onMediaSelect,
  onSnapStart,
  onVoiceMessage,
  isLoading = false,
  recipientId,
  replyToMessage,
  onReplyCancel
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="p-2 bg-background border-t border-border">
      {replyToMessage && (
        <div className="mb-2 bg-muted/20 p-2 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Replying to:</p>
            <p className="text-sm truncate">{replyToMessage.content}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={onReplyCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          {onMediaSelect && (
            <AttachmentButton onImageSelect={onMediaSelect} onDocumentSelect={onMediaSelect} />
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            type="button"
            className="h-9 w-9 rounded-full"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2 z-10">
            <EmojiPicker 
              onEmojiSelect={(emoji) => {
                setMessage(prev => prev + emoji);
                setShowEmojiPicker(false);
              }}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        )}

        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 min-h-[40px] max-h-[120px] w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          rows={1}
        />

        {isVoiceRecording ? (
          <VoiceRecorder 
            onSend={(audioBlob) => {
              if (onVoiceMessage) {
                onVoiceMessage(audioBlob);
                setIsVoiceRecording(false);
              }
            }}
            onCancel={() => setIsVoiceRecording(false)}
          />
        ) : (
          <MessageControls 
            message={message} 
            isLoading={isLoading}
            onSend={() => {
              if (message.trim()) {
                onSendMessage(message);
                setMessage('');
              }
            }}
            onVoiceStart={() => {
              if (onVoiceMessage) {
                setIsVoiceRecording(true);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};
