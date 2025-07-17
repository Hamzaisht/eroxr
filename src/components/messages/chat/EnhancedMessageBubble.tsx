import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit2, Trash2, Copy, Heart, Reply } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  message_type?: string;
  created_at: string;
}

interface EnhancedMessageBubbleProps {
  message: Message;
  isOwn: boolean;
  userProfile?: {
    username?: string;
    avatar_url?: string;
  };
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  showAvatar?: boolean;
  isConsecutive?: boolean;
}

export const EnhancedMessageBubble = ({
  message,
  isOwn,
  userProfile,
  onEdit,
  onDelete,
  onReply,
  showAvatar = true,
  isConsecutive = false
}: EnhancedMessageBubbleProps) => {
  const [showActions, setShowActions] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Auto-hide actions after delay
  useEffect(() => {
    if (showActions) {
      timeoutRef.current = setTimeout(() => {
        setShowActions(false);
      }, 3000);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showActions]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      title: "Message copied",
      description: "Message copied to clipboard",
    });
    setShowActions(false);
  };

  const handleEdit = () => {
    onEdit?.(message.id);
    setShowActions(false);
  };

  const handleDelete = () => {
    onDelete?.(message.id);
    setShowActions(false);
  };

  const handleReply = () => {
    onReply?.(message.id);
    setShowActions(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setShowLikeAnimation(true);
    setTimeout(() => setShowLikeAnimation(false), 600);
  };

  const handleLongPress = () => {
    setShowActions(true);
    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Touch handlers for mobile long press
  const touchStartRef = useRef<number>(0);
  const handleTouchStart = () => {
    touchStartRef.current = Date.now();
  };

  const handleTouchEnd = () => {
    const touchDuration = Date.now() - touchStartRef.current;
    if (touchDuration >= 500) { // 500ms for long press
      handleLongPress();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        mass: 0.8
      }}
      className={cn(
        "flex group relative",
        isOwn ? 'justify-end' : 'justify-start',
        isConsecutive && !isOwn ? 'ml-11' : '',
        isConsecutive ? 'mt-1' : 'mt-3'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={cn(
        "flex items-end space-x-2 max-w-xs lg:max-w-md xl:max-w-lg relative",
        isOwn && "flex-row-reverse space-x-reverse"
      )}>
        {/* Avatar - only show for non-consecutive messages */}
        {!isOwn && showAvatar && !isConsecutive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Avatar className="h-8 w-8 border-2 border-white/20">
              <AvatarImage src={userProfile?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500/30 to-cyan-500/30 text-white text-sm">
                {userProfile?.username?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        )}
        
        <div className="relative max-w-full">
          {/* Main message bubble with enhanced styling */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "px-3 py-2 md:px-4 md:py-3 rounded-2xl backdrop-blur-sm transition-all duration-300 relative",
              "shadow-lg border",
              isOwn
                ? cn(
                    "bg-gradient-to-r from-primary/90 to-primary/80 text-white",
                    "border-primary/30 shadow-primary/20",
                    isConsecutive ? "rounded-br-md" : "rounded-br-sm"
                  )
                : cn(
                    "bg-black/60 text-white border-white/10",
                    "shadow-black/20",
                    isConsecutive ? "rounded-bl-md" : "rounded-bl-sm"
                  )
            )}
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            {/* Message content with improved typography */}
            {message.message_type === 'text' || !message.message_type ? (
              <p className="break-words text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            ) : message.message_type === 'image' ? (
              <div className="space-y-2">
                <motion.img 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  src={message.content} 
                  alt="Image"
                  className="max-w-[250px] max-h-[300px] w-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            ) : message.message_type === 'video' ? (
              <div className="space-y-2">
                <video 
                  controls 
                  className="max-w-[250px] max-h-[300px] w-full rounded-lg"
                  preload="metadata"
                >
                  <source src={message.content} />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  📎
                </div>
                <div>
                  <p className="text-sm font-medium">File attachment</p>
                  <p className="text-xs opacity-70">Click to download</p>
                </div>
              </div>
            )}

            {/* Timestamp - only show on hover or for the last message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showActions ? 0.7 : 0 }}
              className="text-xs mt-1 text-right"
            >
              {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
            </motion.div>
          </motion.div>

          {/* Like animation overlay */}
          <AnimatePresence>
            {showLikeAnimation && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick actions (mobile and desktop) */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "absolute top-0 flex gap-1 bg-black/80 backdrop-blur-md rounded-full px-2 py-1 shadow-lg",
                  isOwn ? "-left-2 -translate-x-full" : "-right-2 translate-x-full"
                )}
              >
                {/* Quick like button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                  onClick={handleLike}
                >
                  <Heart className={cn("h-3 w-3", isLiked && "fill-red-500 text-red-500")} />
                </Button>

                {/* Reply button */}
                {onReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                    onClick={handleReply}
                  >
                    <Reply className="h-3 w-3" />
                  </Button>
                )}

                {/* More actions dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-white/20 text-white"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="bg-black/90 border-white/20 backdrop-blur-xl"
                    align={isOwn ? "end" : "start"}
                  >
                    <DropdownMenuItem 
                      onClick={handleCopy}
                      className="text-white hover:bg-white/10 cursor-pointer"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </DropdownMenuItem>
                    
                    {isOwn && onEdit && (
                      <DropdownMenuItem 
                        onClick={handleEdit}
                        className="text-white hover:bg-white/10 cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    
                    {isOwn && onDelete && (
                      <DropdownMenuItem 
                        onClick={handleDelete}
                        className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};