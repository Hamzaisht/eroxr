import { useState, memo, useCallback, useMemo, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ConversationSidebar } from '@/components/messages/ConversationSidebar';
import { SimpleOptimizedChatArea } from '@/components/messages/SimpleOptimizedChatArea';
import { ChatDetails } from '@/components/messages/ChatDetails';
import { CallHistory } from '@/components/messages/CallHistory';
import { CallNotifications } from '@/components/messages/CallNotifications';
import { DemoConversations } from '@/components/messages/DemoConversations';
import { InteractiveNav } from '@/components/layout/InteractiveNav';
import { PermissionHandler } from '@/components/messages/PermissionHandler';
import { LuxuryGradientBackground } from '@/components/ui/luxury-gradient-background';
import { LuxuryGlassCard } from '@/components/ui/luxury-glass-card';
import { LuxuryTabs } from '@/components/ui/luxury-tabs';
import { Luxury3DButton } from '@/components/ui/luxury-3d-button';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Video, Sparkles, Zap, Menu, X, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const Messages = memo(() => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('conversations');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { user } = useCurrentUser();

  // Responsive breakpoint detection
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
      // Auto-close mobile menu on desktop
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Auto-close mobile menu when selecting conversation
  useEffect(() => {
    if (selectedConversationId && !isDesktop) {
      setIsMobileMenuOpen(false);
    }
  }, [selectedConversationId, isDesktop]);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleSelectConversation = useCallback((id: string | null) => {
    setSelectedConversationId(id);
  }, []);

  const handleShowDetails = useCallback(() => {
    setShowDetails(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setShowDetails(false);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handleBackToConversations = useCallback(() => {
    setSelectedConversationId(null);
    setShowDetails(false);
  }, []);

  // Memoize tabs to prevent recreation
  const tabs = useMemo(() => [
    { id: 'conversations', label: 'Messages', icon: MessageCircle },
    { id: 'calls', label: 'Calls', icon: Phone }
  ], []);

  // Enhanced luxury welcome content with better animations
  const renderLuxuryWelcome = useMemo(() => (
    <div className="flex-1 flex items-center justify-center p-4 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-2xl w-full"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          className="text-4xl md:text-8xl mb-4 md:mb-8"
        >
          💎
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-5xl font-bold mb-3 md:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
        >
          Luxury Communications
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-white/80 text-sm md:text-xl mb-6 md:mb-12 leading-relaxed px-4"
        >
          Experience the pinnacle of digital communication with our award-winning platform
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-12 px-4"
        >
          <LuxuryGlassCard variant="primary" className="p-3 md:p-6 text-center" floating>
            <Video className="h-6 w-6 md:h-12 md:w-12 text-purple-400 mx-auto mb-2 md:mb-4" />
            <h3 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">4K Video Calls</h3>
            <p className="text-white/60 text-xs md:text-sm">Crystal clear communication</p>
          </LuxuryGlassCard>
          
          <LuxuryGlassCard variant="accent" className="p-3 md:p-6 text-center" floating>
            <Zap className="h-6 w-6 md:h-12 md:w-12 text-cyan-400 mx-auto mb-2 md:mb-4" />
            <h3 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Instant Messaging</h3>
            <p className="text-white/60 text-xs md:text-sm">Lightning-fast delivery</p>
          </LuxuryGlassCard>
          
          <LuxuryGlassCard variant="secondary" className="p-3 md:p-6 text-center" floating>
            <Sparkles className="h-6 w-6 md:h-12 md:w-12 text-pink-400 mx-auto mb-2 md:mb-4" />
            <h3 className="text-white font-semibold mb-1 md:mb-2 text-sm md:text-base">Premium Features</h3>
            <p className="text-white/60 text-xs md:text-sm">Exclusive luxury experience</p>
          </LuxuryGlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, type: "spring", stiffness: 300, damping: 25 }}
          className="px-4"
        >
          <Luxury3DButton 
            variant="primary" 
            size={isDesktop ? "lg" : "md"}
            className="font-semibold tracking-wide w-full md:w-auto"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden md:inline">Select a conversation to begin</span>
            <span className="md:hidden">Start Chatting</span>
          </Luxury3DButton>
        </motion.div>
      </motion.div>
    </div>
  ), [isDesktop]);

  if (!user) {
    return (
      <>
        <InteractiveNav />
        <LuxuryGradientBackground />
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
          <LuxuryGlassCard variant="accent" className="max-w-md w-full p-6 md:p-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="text-4xl md:text-6xl mb-4 md:mb-6"
              >
                💎
              </motion.div>
              <h2 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Luxury Access Required
              </h2>
              <p className="text-white/70 text-sm md:text-lg leading-relaxed">
                Please sign in to experience our premium messaging suite
              </p>
            </div>
          </LuxuryGlassCard>
        </div>
      </>
    );
  }

  const renderMobileHeader = () => (
    <div className="md:hidden flex items-center justify-between p-4 bg-black/40 backdrop-blur-md border-b border-white/10 relative z-50">
      {selectedConversationId ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToConversations}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back</span>
        </Button>
      ) : (
        <h1 className="text-xl font-bold text-white">Messages</h1>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMobileMenu}
        className="text-white/70 hover:text-white hover:bg-white/10"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </div>
  );

  const renderSidebar = () => (
    <div className={cn(
      "md:relative md:flex md:w-96",
      // Mobile: full screen overlay
      "fixed inset-0 z-40 md:z-auto",
      isMobileMenuOpen ? "flex" : "hidden md:flex"
    )}>
      {/* Mobile backdrop */}
      <div 
        className="md:hidden absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      <LuxuryGlassCard 
        variant="secondary" 
        className={cn(
          "flex flex-col border-slate-700/30 relative z-10",
          "md:m-4 md:mr-2", // Desktop margins
          "m-4 mr-16", // Mobile: leave space for close button
          "w-full md:w-auto"
        )}
        intensity="heavy"
      >
        <div className="p-4 md:p-6 border-b border-white/10">
          <LuxuryTabs 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
        
        <div className="flex-1 overflow-hidden">
          {activeTab === 'conversations' ? (
            <ConversationSidebar 
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
            />
          ) : (
            <CallHistory />
          )}
        </div>
      </LuxuryGlassCard>
    </div>
  );

  const renderMainContent = () => (
    <div className="flex-1 flex md:m-4 md:ml-2 gap-2 md:gap-4 p-2 md:p-0">
      {selectedConversationId ? (
        <>
          <LuxuryGlassCard 
            variant="primary" 
            className="flex-1 flex flex-col min-h-0"
            intensity="heavy"
          >
            <SimpleOptimizedChatArea 
              conversationId={selectedConversationId}
              onShowDetails={handleShowDetails}
            />
          </LuxuryGlassCard>
          
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                  "md:relative md:w-80",
                  "fixed inset-y-0 right-0 w-80 z-30"
                )}
              >
                <LuxuryGlassCard 
                  variant="accent" 
                  className="h-full flex flex-col"
                  intensity="heavy"
                >
                  <ChatDetails 
                    conversationId={selectedConversationId}
                    onClose={handleCloseDetails}
                  />
                </LuxuryGlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <LuxuryGlassCard 
          variant="primary" 
          className="flex-1 min-h-0"
          intensity="heavy"
        >
          {renderLuxuryWelcome}
        </LuxuryGlassCard>
      )}
    </div>
  );

  const renderMessagesContent = () => (
    <PermissionHandler>
      <LuxuryGradientBackground />
      <div className="min-h-screen relative z-10 flex flex-col">
        <DemoConversations />
        
        {renderMobileHeader()}
        
        <div className="flex-1 flex md:h-[calc(100vh-4rem)] h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] relative">
          {/* Desktop: Show sidebar always, Mobile: Show as overlay */}
          {isDesktop && renderSidebar()}
          {!isDesktop && renderSidebar()}
          
          {/* Main content area */}
          <div className={cn(
            "flex-1 flex flex-col",
            // Hide main content on mobile when sidebar is open and no conversation selected
            !isDesktop && isMobileMenuOpen && !selectedConversationId && "hidden"
          )}>
            {renderMainContent()}
          </div>
        </div>

        <CallNotifications />
      </div>
    </PermissionHandler>
  );

  return (
    <>
      <InteractiveNav />
      <div className="md:ml-20">
        {renderMessagesContent()}
      </div>
    </>
  );
});

Messages.displayName = 'Messages';

export default Messages;