
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { HomeLayout } from "@/components/home/HomeLayout";
import { ConversationsList } from "@/components/messages/ConversationsList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useNavigate, useLocation } from "react-router-dom";

const Messages = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract userId from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    if (userId) {
      setSelectedUserId(userId);
    }
  }, [location]);
  
  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowDetails(false);
    
    // Update URL with selected userId for deep linking
    navigate(`/messages?userId=${userId}`, { replace: true });
  };
  
  const handleNewMessage = () => {
    // Open dialog to start new conversation
  };
  
  const handleToggleDetails = () => {
    setShowDetails(prev => !prev);
  };
  
  const handleBackToList = () => {
    setSelectedUserId(null);
    navigate('/messages', { replace: true });
  };
  
  return (
    <HomeLayout>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-20 pb-20"
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-luxury-neutral mb-8 hidden md:block">
            Messages
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[80vh] bg-luxury-darker/40 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden">
            {/* Conversations List - Hidden on mobile when a chat is selected */}
            <div className={`${isMobile && selectedUserId ? 'hidden' : 'block'} md:col-span-1 border-r border-white/10 h-full`}>
              <ConversationsList
                onSelectUser={handleSelectUser}
                onNewMessage={handleNewMessage}
              />
            </div>
            
            {/* Chat Window */}
            {selectedUserId ? (
              <div className={`col-span-1 md:col-span-2 lg:col-span-3 flex flex-col h-full ${isMobile ? 'absolute inset-0 z-10 bg-luxury-darker/90' : ''}`}>
                <ChatWindow
                  recipientId={selectedUserId}
                  onToggleDetails={handleToggleDetails}
                />
              </div>
            ) : (
              <div className="hidden md:flex md:col-span-2 lg:col-span-3 items-center justify-center h-full">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-luxury-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-luxury-primary">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-luxury-neutral mb-2">Your Messages</h2>
                  <p className="text-luxury-neutral/60 max-w-md mx-auto">
                    Select a conversation or start a new one to begin messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.main>
      <Footer />
    </HomeLayout>
  );
};

export default Messages;
