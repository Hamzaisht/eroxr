
import React, { useState, useRef, useEffect } from 'react';
import { Smile, X, Paperclip, Camera, Send, Mic, File, Image, Video, Calendar } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { EmojiPicker } from './message-parts/EmojiPicker';
import { DirectMessage } from '@/integrations/supabase/types/message';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onMediaSelect?: () => void;
  onSnapStart?: () => void;
  onVoiceMessage?: (audioBlob: Blob) => void;
  onBookCall?: () => void;
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
  onBookCall,
  isLoading = false,
  recipientId,
  replyToMessage,
  onReplyCancel
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState('40px');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '40px';
      const scrollHeight = inputRef.current.scrollHeight;
      const newHeight = Math.min(120, Math.max(40, scrollHeight)) + 'px';
      setTextareaHeight(newHeight);
      inputRef.current.style.height = newHeight;
    }
  }, [message]);
  
  // Focus on textarea when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Handle file selection
  const handleFileUpload = (type: 'image' | 'video' | 'document') => {
    if (!fileInputRef.current) return;
    
    switch (type) {
      case 'image':
        fileInputRef.current.accept = 'image/*';
        break;
      case 'video':
        fileInputRef.current.accept = 'video/*';
        break;
      case 'document':
        fileInputRef.current.accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt';
        break;
    }
    
    fileInputRef.current.click();
  };
  
  // Handle key press for sending message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        onSendMessage(message);
        setMessage('');
      }
    }
  };

  return (
    <div className="p-2 bg-luxury-darker/80 backdrop-blur-md border-t border-white/10">
      {replyToMessage && (
        <div className="mb-2 bg-white/5 p-2 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-xs text-white/60">Replying to:</p>
            <p className="text-sm truncate">{replyToMessage.content || "Media message"}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 hover:bg-white/10"
            onClick={onReplyCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex items-end space-x-2">
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    type="button"
                    className="h-10 w-10 rounded-full hover:bg-white/10"
                    aria-label="Add attachment"
                  >
                    <Paperclip className="h-5 w-5 text-white/70" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">
                Add attachment
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenuContent 
            className="bg-black/90 backdrop-blur-md border-white/10 w-56" 
            align="start"
            side="top"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleFileUpload('image')} className="cursor-pointer">
                <Image className="mr-2 h-4 w-4" />
                <span>Image</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFileUpload('video')} className="cursor-pointer">
                <Video className="mr-2 h-4 w-4" />
                <span>Video</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFileUpload('document')} className="cursor-pointer">
                <File className="mr-2 h-4 w-4" />
                <span>Document</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSnapStart} className="cursor-pointer">
                <Camera className="mr-2 h-4 w-4" />
                <span>Snap</span>
              </DropdownMenuItem>
              {onBookCall && (
                <DropdownMenuItem onClick={onBookCall} className="cursor-pointer">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Book Call</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                type="button"
                className="h-10 w-10 rounded-full hover:bg-white/10"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-5 w-5 text-white/70" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Add emoji
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2 z-10">
            <EmojiPicker 
              onEmojiSelect={(emoji) => {
                setMessage(prev => prev + emoji);
                setShowEmojiPicker(false);
                inputRef.current?.focus();
              }}
              onClose={() => setShowEmojiPicker(false)}
            />
          </div>
        )}

        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="w-full resize-none rounded-2xl border border-input bg-luxury-darker/50 px-4 py-2 text-sm ring-offset-background placeholder:text-white/30 text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-luxury-primary/50 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ height: textareaHeight, maxHeight: '120px' }}
            rows={1}
          />
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0 && onMediaSelect) {
              onMediaSelect();
            }
          }}
        />

        {isVoiceRecording ? (
          <div className="flex items-center space-x-2 py-2 px-3 bg-red-500/20 rounded-full">
            <div className="animate-pulse w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-xs text-white/80">Recording...</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full bg-red-500/30 hover:bg-red-500/50"
              onClick={() => setIsVoiceRecording(false)}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          </div>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => {
                    if (message.trim()) {
                      onSendMessage(message);
                      setMessage('');
                    } else if (onVoiceMessage) {
                      setIsVoiceRecording(true);
                    }
                  }}
                  disabled={(!message.trim() && !onVoiceMessage) || isLoading}
                  variant={message.trim() ? "default" : "ghost"}
                  size="icon"
                  className={`h-10 w-10 rounded-full ${message.trim() ? 'bg-luxury-primary hover:bg-luxury-primary/90' : 'hover:bg-white/10'}`}
                >
                  {message.trim() ? (
                    <Send className={`h-5 w-5 ${isLoading ? 'animate-pulse' : ''}`} />
                  ) : (
                    <Mic className="h-5 w-5 text-white/70" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {message.trim() ? 'Send message' : 'Record voice message'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
