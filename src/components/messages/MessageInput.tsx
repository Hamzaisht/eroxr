import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Mic, X, Image, FileText, MapPin, Smile } from "lucide-react";
import { SnapButton } from "./SnapButton";
import { useTypingIndicator, useMessageAudit } from "@/hooks";
import { MediaViewer } from "@/components/media/MediaViewer";
import { VoiceRecorder } from "./VoiceRecorder";
import { EmojiPicker } from "./message-parts/EmojiPicker";
import { DirectMessage } from "@/integrations/supabase/types/message";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onMediaSelect: (files: FileList) => void;
  onSnapStart: () => void;
  onVoiceMessage?: (audioBlob: Blob) => Promise<void>;
  isLoading?: boolean;
  recipientId: string;
  replyToMessage?: DirectMessage | null;
  onReplyCancel?: () => void;
}

export const MessageInput = ({ 
  onSendMessage, 
  onMediaSelect, 
  onSnapStart, 
  onVoiceMessage,
  isLoading,
  recipientId,
  replyToMessage,
  onReplyCancel
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { sendTypingStatus } = useTypingIndicator(recipientId, undefined);
  const { logMessageActivity } = useMessageAudit(undefined, undefined);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      // Log message send attempt
      logMessageActivity('send_attempt', { 
        content: message.trim(),
        recipient_id: recipientId,
        message_type: 'text',
        reply_to_id: replyToMessage?.id
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
      
      // Hide media options
      setShowMediaOptions(false);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Log document upload attempt
      logMessageActivity('document_upload', {
        recipient_id: recipientId,
        file_count: e.target.files.length,
        file_types: Array.from(e.target.files).map(file => file.type)
      });
      
      onMediaSelect(e.target.files);
      
      // Reset the input so the same file can be selected again if needed
      if (documentInputRef.current) {
        documentInputRef.current.value = "";
      }
      
      // Hide media options
      setShowMediaOptions(false);
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
  
  const handleVoiceMessageStart = () => {
    setIsRecordingVoice(true);
  };
  
  const handleVoiceMessageCancel = () => {
    setIsRecordingVoice(false);
  };
  
  const handleVoiceMessageSend = async (audioBlob: Blob) => {
    if (onVoiceMessage) {
      try {
        await onVoiceMessage(audioBlob);
      } catch (error) {
        console.error("Error sending voice message:", error);
      }
      setIsRecordingVoice(false);
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };
  
  const renderReplyPreview = () => {
    if (!replyToMessage) return null;
    
    return (
      <div className="flex items-center px-3 py-2 border-t border-luxury-neutral/10 bg-luxury-primary/5">
        <div className="flex-1 overflow-hidden">
          <p className="text-xs text-luxury-primary mb-0.5">
            Replying to {replyToMessage.sender_id === recipientId ? "them" : "yourself"}
          </p>
          <p className="text-sm truncate text-white/70">
            {replyToMessage.content || (replyToMessage.media_url ? "Media message" : "Message")}
          </p>
        </div>
        {onReplyCancel && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-white/10"
            onClick={onReplyCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  useEffect(() => {
    // Clean up typing indicator on component unmount
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        sendTypingStatus(false, recipientId);
      }
    };
  }, [recipientId, sendTypingStatus]);
  
  if (isRecordingVoice) {
    return <VoiceRecorder onSend={handleVoiceMessageSend} onCancel={handleVoiceMessageCancel} />;
  }

  return (
    <>
      {renderReplyPreview()}
      
      <div className="flex items-center gap-2 p-2 border-t border-luxury-neutral/10 bg-luxury-dark-secondary relative">
        <SnapButton onCaptureStart={onSnapStart} />
        
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,video/*"
          multiple
        />
        
        <input 
          type="file"
          ref={documentInputRef}
          className="hidden"
          onChange={handleDocumentChange}
          accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
          multiple
        />
        
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            type="button"
            className="h-9 w-9 rounded-full"
            onClick={() => setShowMediaOptions(!showMediaOptions)}
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5 text-luxury-neutral" />
          </Button>
          
          {showMediaOptions && (
            <div className="absolute bottom-full mb-2 left-0 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10 p-1 z-10">
              <div className="grid grid-cols-1 gap-1 w-40">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex justify-start px-3 py-1.5 h-auto text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Photo or Video
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex justify-start px-3 py-1.5 h-auto text-xs"
                  onClick={() => documentInputRef.current?.click()}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Document
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex justify-start px-3 py-1.5 h-auto text-xs"
                  onClick={() => {
                    setShowMediaOptions(false);
                    alert("Location sharing will be implemented in a future update");
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            type="button"
            className="h-9 w-9 rounded-full"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            aria-label="Add emoji"
          >
            <Smile className="h-5 w-5 text-luxury-neutral" />
          </Button>
          
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2 left-0 z-10">
              <EmojiPicker 
                onEmojiSelect={handleEmojiSelect} 
                onClose={() => setShowEmojiPicker(false)} 
              />
            </div>
          )}
        </div>
        
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
        
        {message.trim() ? (
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
        ) : (
          <Button 
            onClick={handleVoiceMessageStart}
            disabled={isLoading}
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            aria-label="Record voice message"
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}
      </div>

      <MediaViewer 
        media={selectedMedia} 
        onClose={() => setSelectedMedia(null)}
      />
    </>
  );
};
