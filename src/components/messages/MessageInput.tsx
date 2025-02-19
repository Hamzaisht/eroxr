
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface MessageInputProps {
  onSendMessage: (content: string, mediaUrl?: string[]) => void;
  onMediaSelect?: (files: FileList) => Promise<void>;
  onSnapStart?: () => void;
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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const session = useSession();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const emitTypingEvent = () => {
    if (!session?.user?.id) return;

    // Emit typing event through Supabase realtime
    supabase.channel('typing-status')
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          user_id: session.user.id,
          recipient_id: recipientId,
          is_typing: true
        }
      });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to clear typing status
    typingTimeoutRef.current = setTimeout(() => {
      supabase.channel('typing-status')
        .send({
          type: 'broadcast',
          event: 'typing',
          payload: {
            user_id: session.user.id,
            recipient_id: recipientId,
            is_typing: false
          }
        });
    }, 2000); // Stop showing typing indicator after 2 seconds of no input
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = async () => {
    if (!message.trim() && !fileInputRef.current?.files?.length) return;
    
    try {
      let mediaUrls: string[] = [];
      
      if (fileInputRef.current?.files?.length) {
        if (onMediaSelect) {
          await onMediaSelect(fileInputRef.current.files);
        } else {
          setIsUploading(true);
          const file = fileInputRef.current.files[0];
          const fileExt = file.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('messages')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          if (uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('messages')
              .getPublicUrl(fileName);
            
            mediaUrls = [publicUrl];
          }
        }
      }

      onSendMessage(message, mediaUrls);
      setMessage("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-center gap-3 p-6 border-t border-white/5 bg-luxury-dark">
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-darker to-transparent opacity-50"></div>
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={() => {
          if (fileInputRef.current?.files?.length) {
            handleSend();
          }
        }}
      />

      <div className="relative flex items-center gap-2 bg-luxury-darker/50 backdrop-blur-sm rounded-full p-1.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || isUploading}
          className="rounded-full hover:bg-luxury-primary/20 transition-colors duration-300"
        >
          <Image className="h-5 w-5 text-luxury-neutral" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSnapStart}
          disabled={isLoading || isUploading}
          className="rounded-full hover:bg-luxury-primary/20 transition-colors duration-300"
        >
          <Camera className="h-5 w-5 text-luxury-neutral" />
        </Button>
      </div>

      <div className="relative flex-1">
        <Input
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            emitTypingEvent();
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isLoading || isUploading}
          className="bg-luxury-darker/50 backdrop-blur-sm border-none rounded-full px-6 py-3 text-luxury-neutral placeholder:text-luxury-neutral/50 focus-visible:ring-1 focus-visible:ring-luxury-primary/50 transition-all duration-300"
        />
      </div>

      <div className="relative">
        <Button
          onClick={handleSend}
          disabled={isLoading || isUploading || (!message.trim() && !fileInputRef.current?.files?.length)}
          className="rounded-full bg-luxury-primary hover:bg-luxury-primary/90 transition-all duration-300 disabled:opacity-50 disabled:hover:bg-luxury-primary shadow-lg hover:shadow-luxury-primary/25"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
