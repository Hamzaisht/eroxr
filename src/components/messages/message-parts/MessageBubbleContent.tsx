
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { UniversalMedia } from "@/components/shared/media/UniversalMedia";
import { MediaType } from "@/types/media";
import { MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

// Define Message interface
interface Message {
  id: string;
  content?: string;
  sender_id: string;
  created_at: string;
  updated_at?: string;
  original_content?: string;
  media_url?: string[];
  viewed_at?: string;
  message_type?: string;
  delivery_status?: 'sent' | 'delivered' | 'seen' | 'failed';
}

// Define MessageActions interface
interface MessageActionsProps {
  onActionClick: (action: string) => void;
  onReport: () => Promise<void>;
}

// Create a simplified MessageActions component
const MessageActions = ({ onActionClick, onReport }: MessageActionsProps) => (
  <div className="absolute right-0 bottom-full mb-1 bg-luxury-dark/90 backdrop-blur-sm rounded-md shadow-lg py-1 z-20">
    <ul className="text-xs">
      <li>
        <button 
          className="px-4 py-1.5 w-full text-left hover:bg-luxury-primary/20 transition-colors" 
          onClick={() => onActionClick('copy')}
        >
          Copy
        </button>
      </li>
      <li>
        <button 
          className="px-4 py-1.5 w-full text-left hover:bg-luxury-primary/20 transition-colors" 
          onClick={() => onActionClick('reply')}
        >
          Reply
        </button>
      </li>
      <li>
        <button 
          className="px-4 py-1.5 w-full text-left hover:bg-luxury-primary/20 transition-colors" 
          onClick={() => onReport()}
        >
          Report
        </button>
      </li>
    </ul>
  </div>
);

interface MessageBubbleContentProps {
  message: Message;
  isOwnMessage: boolean;
  onImageClick?: (url: string) => void;
}

export const MessageBubbleContent: React.FC<MessageBubbleContentProps> = ({
  message,
  isOwnMessage,
  onImageClick
}) => {
  const [showActions, setShowActions] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Fetch user data
    if (message.sender_id) {
      supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', message.sender_id)
        .single()
        .then(({ data }) => {
          if (data) setUser(data);
        });
    }
  }, [message.sender_id, supabase]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [messageRef]);
  
  const handleActionClick = (action: string) => {
    console.log(`Action ${action} clicked for message ${message.id}`);
    setShowActions(false);
  };
  
  const handleReport = async () => {
    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: user?.id,
          reported_id: message.sender_id,
          content_id: message.id,
          content_type: 'message',
          reason: 'Inappropriate content',
          description: 'Reported via message actions'
        });
        
      if (error) {
        console.error("Error reporting message:", error);
        toast({
          title: "Error",
          description: "Could not report message",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Reported",
        description: "Message has been reported for review"
      });
    } catch (error) {
      console.error("Error reporting message:", error);
      toast({
        title: "Error",
        description: "Could not report message",
        variant: "destructive"
      });
    } finally {
      setShowActions(false);
    }
  };

  const renderMessageContent = () => {
    if (message.media_url && message.media_url.length > 0) {
      return renderImage(message.media_url[0], onImageClick);
    } else if (message.content) {
      return <p className="text-sm break-words">{message.content}</p>;
    } else {
      return <p className="text-sm italic">Unsupported message type</p>;
    }
  };

  const renderImage = (url: string, onImgClick?: (url: string) => void) => {
    return (
      <div 
        className="relative w-full cursor-pointer"
        onClick={() => onImgClick && onImgClick(url)}
      >
        <UniversalMedia
          item={{
            url: url,
            type: MediaType.IMAGE
          }}
          className="rounded-lg overflow-hidden max-h-48 w-auto" 
          controls={false}
          autoPlay={false}
          onError={() => console.error(`Failed to load image: ${url}`)}
        />
      </div>
    );
  };

  return (
    <div
      ref={messageRef}
      className={cn(
        "relative flex flex-col w-full rounded-2xl px-3 py-2",
        isOwnMessage ? "bg-luxury-primary/10 items-end" : "bg-luxury-dark/30 items-start"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar and Username */}
      {!isOwnMessage && user && (
        <div className="flex items-center space-x-2 mb-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.avatar_url} alt={user.username} />
            <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium">{user.username}</span>
        </div>
      )}

      {/* Message Content */}
      <div className="w-full">
        {renderMessageContent()}
      </div>

      {/* Timestamp and Actions */}
      <div className="flex items-center justify-between w-full mt-1">
        <span className="text-xs text-luxury-neutral/60">
          {format(new Date(message.created_at), 'MMM dd, HH:mm')}
        </span>
        
        {/* Actions Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className={cn(
            "p-1 rounded-full hover:bg-luxury-dark/40 transition-colors",
            (showActions || isHovered) ? "visible" : "invisible"
          )}
          aria-label="Message actions"
        >
          <MoreHorizontal className="h-4 w-4 text-luxury-neutral/70" />
        </button>
      </div>

      {/* Message Actions Dropdown */}
      {showActions && (
        <MessageActions
          onActionClick={handleActionClick}
          onReport={handleReport}
        />
      )}
    </div>
  );
};

export default MessageBubbleContent;
