import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit2, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender_id: string;
    message_type?: string;
    created_at: string;
  };
  isOwn: boolean;
  userProfile?: {
    username?: string;
    avatar_url?: string;
  };
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
}

export const MessageBubble = ({
  message,
  isOwn,
  userProfile,
  onEdit,
  onDelete
}: MessageBubbleProps) => {
  const [showActions, setShowActions] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      title: "Message copied",
      description: "Message copied to clipboard",
    });
  };

  const handleEdit = () => {
    onEdit?.(message.id);
  };

  const handleDelete = () => {
    onDelete?.(message.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-end space-x-2 max-w-xs lg:max-w-md relative">
        {!isOwn && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={userProfile?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs">
              {userProfile?.username?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="relative">
          <motion.div
            className={`px-4 py-3 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
              isOwn
                ? 'bg-white/95 text-gray-900 rounded-br-md shadow-lg border border-white/20'
                : 'bg-gray-900/80 text-white border border-gray-700/50 rounded-bl-md shadow-xl'
            }`}
            style={{
              backdropFilter: 'blur(20px)',
              boxShadow: isOwn 
                ? '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Render message content based on type */}
            {message.message_type === 'text' || !message.message_type ? (
              <p className="break-words">{message.content}</p>
            ) : message.message_type === 'image' ? (
              <div className="space-y-2">
                <img 
                  src={message.content} 
                  alt="Image"
                  className="max-w-[200px] max-h-[200px] object-cover rounded-md"
                />
              </div>
            ) : message.message_type === 'video' ? (
              <div className="space-y-2">
                <video 
                  controls 
                  className="max-w-[200px] max-h-[200px] object-cover rounded-md"
                >
                  <source src={message.content} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : message.message_type === 'file' ? (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white/10 rounded">
                  📎
                </div>
                <a 
                  href={message.content} 
                  download 
                  className="text-blue-400 hover:underline"
                >
                  Download File
                </a>
              </div>
            ) : (
              <p className="break-words">{message.content}</p>
            )}
          </motion.div>

          {/* Message Actions */}
          <AnimatePresence>
            {(showActions || isOwn) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={`absolute top-0 ${isOwn ? '-left-10' : '-right-10'} flex items-center`}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/90 border-white/20 backdrop-blur-xl">
                    <DropdownMenuItem onClick={handleCopy} className="text-white hover:bg-white/10">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </DropdownMenuItem>
                    {isOwn && (
                      <>
                        <DropdownMenuItem onClick={handleEdit} className="text-white hover:bg-white/10">
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="text-red-400 hover:bg-red-400/10">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </>
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