import { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ConversationSidebar } from '@/components/messages/ConversationSidebar';
import { ChatArea } from '@/components/messages/ChatArea';
import { ChatDetails } from '@/components/messages/ChatDetails';
import { CallHistory } from '@/components/messages/CallHistory';
import { CallNotifications } from '@/components/messages/CallNotifications';
import { DemoConversations } from '@/components/messages/DemoConversations';
import { InteractiveNav } from '@/components/layout/InteractiveNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PermissionHandler } from '@/components/messages/PermissionHandler';
import { motion } from 'framer-motion';

const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useCurrentUser();

  if (!user) {
    return (
      <>
        <InteractiveNav />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
              <p className="text-white/70">Please sign in to access messages</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const renderMessagesContent = () => {
    return (
      <PermissionHandler>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Greek pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Demo data utility */}
          <DemoConversations />
          
          <div className="relative z-10 flex min-h-screen">
            {/* Sidebar with Messages and Calls tabs */}
            <div className="w-80 border-r border-white/10 bg-black/20 backdrop-blur-xl">
              <Tabs defaultValue="conversations" className="h-full">
                <div className="p-4 border-b border-white/10">
                  <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-1 shadow-2xl shadow-black/20">
                    <TabsTrigger 
                      value="conversations" 
                      className="relative text-white/70 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-purple-500/80 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 data-[state=active]:border data-[state=active]:border-white/20 rounded-xl font-medium transition-all duration-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-xl overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                        whileHover={{
                          translateX: '100%',
                          transition: { duration: 0.6, ease: 'easeInOut' }
                        }}
                      />
                      <span className="relative z-10">Messages</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="calls" 
                      className="relative text-white/70 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-purple-500/80 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 data-[state=active]:border data-[state=active]:border-white/20 rounded-xl font-medium transition-all duration-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-xl overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                        whileHover={{
                          translateX: '100%',
                          transition: { duration: 0.6, ease: 'easeInOut' }
                        }}
                      />
                      <span className="relative z-10">Calls</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="conversations" className="h-full mt-0">
                  <ConversationSidebar 
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={setSelectedConversationId}
                  />
                </TabsContent>
                
                <TabsContent value="calls" className="h-full mt-0">
                  <CallHistory />
                </TabsContent>
              </Tabs>
            </div>

            {/* Chat Area */}
            <div className="flex-1 min-w-0 flex">
              {selectedConversationId ? (
                <div className="flex-1 flex">
                  <div className="flex-1 min-w-0">
                    <ChatArea 
                      conversationId={selectedConversationId}
                      onShowDetails={() => setShowDetails(true)}
                    />
                  </div>
                  
                  {showDetails && (
                    <div className="w-80 border-l border-white/10">
                      <ChatDetails 
                        conversationId={selectedConversationId}
                        onClose={() => setShowDetails(false)}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="mb-8"
                    >
                      <div className="text-8xl mb-6">💬</div>
                      <h3 className="text-3xl font-bold text-white mb-4">
                        Start Connecting!
                      </h3>
                      <p className="text-white/70 mb-8 text-lg leading-relaxed">
                        Connect with people through messages, voice calls, and video chats. Your conversations await!
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-center gap-4 mb-6">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4 cursor-pointer hover:from-primary/30 hover:to-purple-500/30 transition-all duration-300"
                        >
                          <div className="text-3xl mb-2">📞</div>
                          <p className="text-white text-sm font-medium">Voice Calls</p>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4 cursor-pointer hover:from-primary/30 hover:to-purple-500/30 transition-all duration-300"
                        >
                          <div className="text-3xl mb-2">📹</div>
                          <p className="text-white text-sm font-medium">Video Chats</p>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4 cursor-pointer hover:from-primary/30 hover:to-purple-500/30 transition-all duration-300"
                        >
                          <div className="text-3xl mb-2">⚡</div>
                          <p className="text-white text-sm font-medium">Instant Messages</p>
                        </motion.div>
                      </div>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/50 text-sm"
                      >
                        Select a conversation from the sidebar to begin
                      </motion.p>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>

            {/* Call Notifications */}
            <CallNotifications />
          </div>
        </div>
      </PermissionHandler>
    );
  };

  return (
    <>
      <InteractiveNav />
      <div className="md:ml-20">
        {renderMessagesContent()}
      </div>
    </>
  );
};

export default Messages;