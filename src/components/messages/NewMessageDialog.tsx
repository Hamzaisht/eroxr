
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
      <DialogContent className="max-w-lg holographic-card border-white/20 p-0 overflow-hidden">
        {/* Neural background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <DialogHeader className="p-6 border-b border-white/10 bg-white/[0.02]">
            <DialogTitle className="flex items-center gap-4 text-white">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative w-12 h-12 bg-gradient-to-r from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30"
              >
                <MessageSquare className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold">New Message</h2>
                <p className="text-sm text-white/60 font-normal">Start a new conversation</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Search Section */}
          <div className="p-6 border-b border-white/10">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 transition-colors group-focus-within:text-primary" />
              <input
                placeholder="Search for users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-primary/50 focus:bg-white/[0.12] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-lg focus:shadow-primary/20"
                autoFocus
              />
              {/* Neural transmission lines */}
              <div className="absolute inset-0 rounded-xl pointer-events-none">
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" style={{ transitionDelay: '200ms' }} />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="max-h-96 overflow-hidden">
            <div className="overflow-y-auto custom-scrollbar">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <div className="relative w-12 h-12 mb-4">
                      <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-spin border-t-primary" />
                      <div className="absolute inset-2 border-2 border-purple-500/30 rounded-full animate-spin animate-reverse border-t-purple-500" />
                    </div>
                    <p className="text-white/60">Searching for users...</p>
                  </motion.div>
                ) : !searchTerm.trim() ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 px-6"
                  >
                    <div className="relative w-16 h-16 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full animate-pulse" />
                      <div className="absolute inset-2 bg-gradient-to-r from-primary/40 to-purple-500/40 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white/60" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Find People</h3>
                    <p className="text-white/50">Search for users to start chatting</p>
                  </motion.div>
                ) : users && users.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 space-y-2"
                  >
                    {users.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08, type: "spring", stiffness: 300 }}
                        onClick={() => handleUserSelect(user.id)}
                        className="group relative overflow-hidden p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.08] hover:shadow-lg hover:shadow-primary/20"
                      >
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="relative z-10 flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12 border-2 border-white/20 shadow-lg">
                              <AvatarImage src={user.avatar_url || ''} alt={user.username} />
                              <AvatarFallback className="bg-gradient-to-br from-primary/30 to-purple-500/30 text-white font-semibold">
                                {user.username[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {/* Neural activity indicator */}
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black/50 animate-pulse shadow-lg shadow-green-400/50" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white truncate mb-1">@{user.username}</p>
                            {user.bio && (
                              <p className="text-sm text-white/60 truncate">{user.bio}</p>
                            )}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center group-hover:from-primary/40 group-hover:to-purple-500/40 transition-all duration-300">
                            <MessageSquare className="w-4 h-4 text-primary group-hover:text-white" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : searchTerm.trim() ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 px-6"
                  >
                    <div className="relative w-16 h-16 mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full animate-pulse" />
                      <div className="absolute inset-2 bg-gradient-to-r from-red-500/40 to-orange-500/40 rounded-full flex items-center justify-center">
                        <Search className="w-6 h-6 text-white/60" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Users Found</h3>
                    <p className="text-white/50">Try a different search term</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewMessageDialog;
