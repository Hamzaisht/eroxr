
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
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
      {/* Quantum Background */}
      <div className="absolute inset-0 quantum-profile-container">
        <div className="neural-mesh" />
        <div className="floating-elements">
          <div className="floating-element w-32 h-32 top-20 left-20" style={{ animationDelay: '0s' }} />
          <div className="floating-element w-24 h-24 top-60 right-32" style={{ animationDelay: '2s' }} />
          <div className="floating-element w-16 h-16 bottom-40 left-1/3" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-4 max-w-7xl h-[calc(100vh-5rem)] flex flex-col">
        <motion.div 
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Messages</h1>
          <p className="text-sm text-white/70">Connect and chat with your friends and community</p>
        </motion.div>
        
        <motion.div 
          className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="lg:col-span-1">
            <ConversationsList 
              onSelectUser={handleSelectUser}
              onNewMessage={handleNewMessage}
              selectedUserId={selectedUserId}
            />
          </div>
          <div className="lg:col-span-2">
            {selectedUserId ? (
              <ChatWindow userId={selectedUserId} />
            ) : (
              <motion.div 
                className="flex items-center justify-center h-full holographic-card relative group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {/* Ambient glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 rounded-[20px] blur-xl group-hover:blur-2xl transition-all duration-700" />
                
                <div className="relative text-center z-10">
                  <motion.div
                    className="relative w-24 h-24 mx-auto mb-8"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full animate-spin-slow opacity-20" />
                    <div className="absolute inset-2 glass-morphism-extreme rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  </motion.div>
                  
                  <motion.h3 
                    className="text-2xl font-semibold text-white mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Message Center
                  </motion.h3>
                  <motion.p 
                    className="text-white/60 text-lg leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    Select a conversation to start chatting<br />
                    <span className="text-primary/80">with your friends</span>
                  </motion.p>
                  
                  {/* Floating particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/40 rounded-full"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + (i % 2) * 40}%`,
                        }}
                        animate={{
                          y: [-10, 10, -10],
                          opacity: [0.2, 0.8, 0.2]
                        }}
                        transition={{
                          duration: 3 + i * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
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
    </div>
  );
};

export default Messages;
