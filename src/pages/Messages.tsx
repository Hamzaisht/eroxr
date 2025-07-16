import { useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ConversationSidebar } from '@/components/messages/ConversationSidebar';
import { ChatArea } from '@/components/messages/ChatArea';
import { ChatDetails } from '@/components/messages/ChatDetails';
import { CallHistory } from '@/components/messages/CallHistory';
import { CallNotifications } from '@/components/messages/CallNotifications';
import { DemoConversations } from '@/components/messages/DemoConversations';
import { InteractiveNav } from '@/components/layout/InteractiveNav';
import { PermissionHandler } from '@/components/messages/PermissionHandler';
import { Luxury3DBackground } from '@/components/ui/luxury-3d-background';
import { LuxuryGlassCard } from '@/components/ui/luxury-glass-card';
import { LuxuryTabs } from '@/components/ui/luxury-tabs';
import { Luxury3DButton } from '@/components/ui/luxury-3d-button';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, Video, Sparkles, Zap } from 'lucide-react';

const Messages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('conversations');
  const { user } = useCurrentUser();

  if (!user) {
    return (
      <>
        <InteractiveNav />
        <Luxury3DBackground />
        <div className="min-h-screen flex items-center justify-center p-8">
          <LuxuryGlassCard variant="accent" className="max-w-md w-full p-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-6xl mb-6"
              >
                💎
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Luxury Access Required
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Please sign in to experience our premium messaging suite
              </p>
            </div>
          </LuxuryGlassCard>
        </div>
      </>
    );
  }

  const tabs = [
    { id: 'conversations', label: 'Messages', icon: MessageCircle },
    { id: 'calls', label: 'Calls', icon: Phone }
  ];

  const renderLuxuryWelcome = () => (
    <div className="flex-1 flex items-center justify-center p-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          className="text-8xl mb-8"
        >
          💎
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
        >
          Luxury Communications
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-white/80 text-xl mb-12 leading-relaxed"
        >
          Experience the pinnacle of digital communication with our award-winning platform
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <LuxuryGlassCard variant="primary" className="p-6 text-center" floating>
            <Video className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">4K Video Calls</h3>
            <p className="text-white/60 text-sm">Crystal clear communication</p>
          </LuxuryGlassCard>
          
          <LuxuryGlassCard variant="accent" className="p-6 text-center" floating>
            <Zap className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Instant Messaging</h3>
            <p className="text-white/60 text-sm">Lightning-fast delivery</p>
          </LuxuryGlassCard>
          
          <LuxuryGlassCard variant="secondary" className="p-6 text-center" floating>
            <Sparkles className="h-12 w-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Premium Features</h3>
            <p className="text-white/60 text-sm">Exclusive luxury experience</p>
          </LuxuryGlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, type: "spring", stiffness: 300, damping: 25 }}
        >
          <Luxury3DButton 
            variant="primary" 
            size="lg"
            className="font-semibold tracking-wide"
          >
            <Sparkles className="h-5 w-5" />
            Select a conversation to begin
          </Luxury3DButton>
        </motion.div>
      </motion.div>
    </div>
  );

  const renderMessagesContent = () => {
    return (
      <PermissionHandler>
        <Luxury3DBackground />
        <div className="min-h-screen relative z-10">
          <DemoConversations />
          
          <div className="flex min-h-screen">
            {/* Luxury Sidebar */}
            <LuxuryGlassCard 
              variant="secondary" 
              className="w-96 m-4 mr-2 flex flex-col border-slate-700/30"
              intensity="heavy"
            >
              <div className="p-6 border-b border-white/10">
                <LuxuryTabs 
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </div>
              
              <div className="flex-1 overflow-hidden">
                {activeTab === 'conversations' ? (
                  <ConversationSidebar 
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={setSelectedConversationId}
                  />
                ) : (
                  <CallHistory />
                )}
              </div>
            </LuxuryGlassCard>

            {/* Main Chat Area */}
            <div className="flex-1 flex m-4 ml-2 gap-4">
              {selectedConversationId ? (
                <>
                  <LuxuryGlassCard 
                    variant="primary" 
                    className="flex-1 flex flex-col"
                    intensity="heavy"
                  >
                    <ChatArea 
                      conversationId={selectedConversationId}
                      onShowDetails={() => setShowDetails(true)}
                    />
                  </LuxuryGlassCard>
                  
                  {showDetails && (
                    <LuxuryGlassCard 
                      variant="accent" 
                      className="w-80 flex flex-col"
                      intensity="heavy"
                    >
                      <ChatDetails 
                        conversationId={selectedConversationId}
                        onClose={() => setShowDetails(false)}
                      />
                    </LuxuryGlassCard>
                  )}
                </>
              ) : (
                <LuxuryGlassCard 
                  variant="primary" 
                  className="flex-1"
                  intensity="heavy"
                >
                  {renderLuxuryWelcome()}
                </LuxuryGlassCard>
              )}
            </div>
          </div>

          <CallNotifications />
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