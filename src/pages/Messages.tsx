
import ConversationsList from "@/components/messages/ConversationsList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { NewMessageDialog } from "@/components/messages/NewMessageDialog";
import { useState } from "react";
import { motion } from "framer-motion";

const Messages = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleNewMessage = () => {
    setShowNewMessageDialog(true);
  };

  const handleNewMessageUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setShowNewMessageDialog(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
        <p className="text-white/60">Stay connected with your conversations</p>
      </motion.div>
      
      <motion.div 
        className="grid md:grid-cols-3 gap-6 h-[calc(100vh-200px)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="md:col-span-1">
          <ConversationsList 
            onSelectUser={handleSelectUser}
            onNewMessage={handleNewMessage}
            selectedUserId={selectedUserId}
          />
        </div>
        <div className="md:col-span-2">
          {selectedUserId ? (
            <ChatWindow userId={selectedUserId} />
          ) : (
            <motion.div 
              className="flex items-center justify-center h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </motion.div>
                <p className="text-white/60 text-lg">Select a conversation to start chatting</p>
                <p className="text-white/40 text-sm mt-2">or create a new message</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <NewMessageDialog 
        open={showNewMessageDialog}
        onOpenChange={setShowNewMessageDialog}
        onSelectUser={handleNewMessageUserSelect}
      />
    </div>
  );
};

export default Messages;
