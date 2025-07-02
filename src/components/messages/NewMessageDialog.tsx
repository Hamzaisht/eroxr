
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (userId: string) => void;
}

interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
}

export const NewMessageDialog = ({ open, onOpenChange, onSelectUser }: NewMessageDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const session = useSession();

  const { data: users, isLoading } = useQuery({
    queryKey: ['users-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, bio')
        .neq('id', session?.user?.id)
        .ilike('username', `%${searchTerm}%`)
        .limit(10);

      if (error) throw error;
      return data as Profile[];
    },
    enabled: !!searchTerm.trim() && !!session?.user?.id
  });

  const handleUserSelect = (userId: string) => {
    onSelectUser(userId);
    onOpenChange(false);
    setSearchTerm('');
  };

  const handleClose = () => {
    onOpenChange(false);
    setSearchTerm('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-black/95 backdrop-blur-xl border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-8 h-8 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center"
            >
              <MessageSquare className="w-4 h-4 text-white" />
            </motion.div>
            New Message
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              autoFocus
            />
          </div>

          <div className="max-h-80 overflow-y-auto">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-8"
                >
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </motion.div>
              ) : !searchTerm.trim() ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 text-white/60"
                >
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-white/30" />
                  <p>Search for users to start a conversation</p>
                </motion.div>
              ) : users && users.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  {users.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleUserSelect(user.id)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                    >
                      <Avatar className="h-10 w-10 border border-white/20">
                        <AvatarImage src={user.avatar_url || ''} alt={user.username} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20 text-white">
                          {user.username[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">@{user.username}</p>
                        {user.bio && (
                          <p className="text-sm text-white/60 truncate">{user.bio}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : searchTerm.trim() ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8 text-white/60"
                >
                  <Search className="w-12 h-12 mx-auto mb-3 text-white/30" />
                  <p>No users found</p>
                  <p className="text-sm">Try a different search term</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
