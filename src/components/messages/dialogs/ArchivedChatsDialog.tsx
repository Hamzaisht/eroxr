import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Archive, MessageCircle, ArchiveRestore } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface ArchivedChatsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for archived chats - replace with real data
const mockArchivedChats = [
  {
    id: '1',
    username: 'Alice Johnson',
    avatar_url: '/placeholder-avatar.jpg',
    lastMessage: 'Thanks for the chat!',
    archivedAt: '2 days ago'
  },
  {
    id: '2', 
    username: 'Bob Smith',
    avatar_url: '/placeholder-avatar.jpg',
    lastMessage: 'See you later!',
    archivedAt: '1 week ago'
  }
];

export const ArchivedChatsDialog = ({
  isOpen,
  onClose
}: ArchivedChatsDialogProps) => {
  const [archivedChats, setArchivedChats] = useState(mockArchivedChats);
  const { toast } = useToast();

  const handleUnarchive = (chatId: string) => {
    setArchivedChats(prev => prev.filter(chat => chat.id !== chatId));
    toast({
      title: "Chat unarchived",
      description: "The conversation has been moved back to your main chat list",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-white/20 backdrop-blur-xl text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archived Chats
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Manage your archived conversations
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {archivedChats.length === 0 ? (
            <div className="text-center py-8">
              <Archive className="h-12 w-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/60">No archived chats</p>
              <p className="text-white/40 text-sm">Archived conversations will appear here</p>
            </div>
          ) : (
            archivedChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={chat.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                    {chat.username[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white truncate">{chat.username}</h4>
                  <p className="text-sm text-white/60 truncate">{chat.lastMessage}</p>
                  <p className="text-xs text-white/40">Archived {chat.archivedAt}</p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUnarchive(chat.id)}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <ArchiveRestore className="h-4 w-4" />
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};