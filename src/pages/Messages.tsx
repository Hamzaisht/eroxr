import { useState } from 'react';
import { motion } from 'framer-motion';
import { InteractiveNav } from "@/components/layout/InteractiveNav";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePlatformSubscription } from "@/hooks/usePlatformSubscription";
import { FreemiumTeaser } from "@/components/subscription/FreemiumTeaser";
import { ConversationSidebar } from '@/components/messages/ConversationSidebar';
import { ChatArea } from '@/components/messages/ChatArea';
import { ChatDetails } from '@/components/messages/ChatDetails';
import { CallHistory } from '@/components/messages/CallHistory';
import { CallNotifications } from '@/components/messages/CallNotifications';
import { DemoConversations } from '@/components/messages/DemoConversations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useCurrentUser();
  const { hasPremium } = usePlatformSubscription();

  if (!user) {
    return (
      <>
        <InteractiveNav />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="md:ml-20 flex items-center justify-center min-h-[60vh]">
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
                    className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-purple-500/80 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 data-[state=active]:border data-[state=active]:border-white/20 rounded-xl font-medium transition-all duration-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-xl"
                  >
                    Messages
                  </TabsTrigger>
                  <TabsTrigger 
                    value="calls" 
                    className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-purple-500/80 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 data-[state=active]:border data-[state=active]:border-white/20 rounded-xl font-medium transition-all duration-300 hover:text-white hover:bg-white/10 hover:backdrop-blur-xl"
                  >
                    Calls
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
          <div className="flex-1 flex">
            <div className="flex-1">
              {selectedConversationId ? (
                <ChatArea 
                  conversationId={selectedConversationId}
                  onShowDetails={() => setShowDetails(!showDetails)}
                />
              ) : (
                <motion.div 
                  className="h-full flex items-center justify-center bg-black/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center backdrop-blur-xl border border-white/10">
                      <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Welcome to Eroxr Messages</h3>
                    <p className="text-white/60 text-lg">Select a conversation to start messaging</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Chat Details Sidebar */}
            {showDetails && selectedConversationId && (
              <motion.div 
                className="w-80 border-l border-white/10 bg-black/20 backdrop-blur-xl"
                initial={{ x: 320 }}
                animate={{ x: 0 }}
                exit={{ x: 320 }}
              >
                <ChatDetails 
                  conversationId={selectedConversationId}
                  onClose={() => setShowDetails(false)}
                />
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Call Notifications */}
        <CallNotifications />
      </div>
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