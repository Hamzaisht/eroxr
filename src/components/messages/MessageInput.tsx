import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MessageInputProps {
  onSendMessage: (content: string, mediaUrl?: string[]) => void;
  onMediaSelect?: (files: FileList) => Promise<void>;
  onSnapStart?: () => void;
  isLoading?: boolean;
}

export const MessageInput = ({ 
  onSendMessage, 
  onMediaSelect, 
  onSnapStart,
  isLoading 
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
    <div className="flex items-center gap-2 p-4 border-t border-border bg-background">
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading || isUploading}
      >
        <Image className="h-5 w-5" />
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        disabled={isLoading || isUploading}
        className="flex-1"
      />
      <Button
        onClick={handleSend}
        disabled={isLoading || isUploading || (!message.trim() && !fileInputRef.current?.files?.length)}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};