
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import ConversationsList from "@/components/messages/ConversationsList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { EmptyChat } from "@/components/messages/EmptyChat";
import { NewMessageDialog } from "@/components/messages/NewMessageDialog";
import ChatDetails from "@/components/messages/ChatDetails";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Update component props definitions if needed
interface ChatWindowProps {
  recipient: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  onToggleDetails: () => void;
  onClose: () => void;
}

const Messages = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState<any>(null);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    if (selectedUserId) {
      const fetchUserInfo = async () => {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", selectedUserId)
          .single();

        if (!error && data) {
          setSelectedUserInfo(data);
        }
      };

      fetchUserInfo();
    }
  }, [selectedUserId]);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    if (isMobile) {
      setShowMobileNav(false);
    }
  };

  const handleNewMessageClick = () => {
    setShowNewMessageDialog(true);
  };

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleBackToList = () => {
    if (isMobile) {
      setShowMobileNav(true);
    } else {
      setSelectedUserId(null);
    }
  };

  // Render for mobile devices
  if (isMobile) {
    return (
      <div className="h-screen bg-luxury-darker">
        {/* Mobile Navigation with Drawer */}
        <Drawer open={showMobileNav} onOpenChange={setShowMobileNav}>
          <DrawerContent className="h-[85vh] bg-luxury-darker border-t border-luxury-primary/20">
            <div className="px-3 py-4 border-b border-luxury-primary/20 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Messages</h2>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
            <div className="flex-1 overflow-auto h-[calc(85vh-4rem)]">
              <ConversationsList 
                onSelectUser={handleSelectUser} 
                onNewMessage={handleNewMessageClick} 
              />
            </div>
          </DrawerContent>
        </Drawer>
      
        {/* Chat Content */}
        <div className="h-full flex flex-col">
          {selectedUserId && selectedUserInfo ? (
            <>
              <div className="flex items-center px-2 py-1 bg-luxury-darker border-b border-luxury-primary/20">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={() => setShowMobileNav(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-medium">{selectedUserInfo.username}</h2>
              </div>
              <ChatWindow
                recipient={{ 
                  id: selectedUserId,
                  username: selectedUserInfo?.username || "User",
                  avatar_url: selectedUserInfo?.avatar_url
                }}
                onToggleDetails={handleToggleDetails}
                onClose={handleBackToList}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Button
                variant="outline"
                onClick={() => setShowMobileNav(true)}
                className="mb-4"
              >
                Select a conversation
              </Button>
            </div>
          )}
          
          {/* Chat Details Sheet for Mobile */}
          {showDetails && selectedUserId && selectedUserInfo && (
            <Sheet open={showDetails} onOpenChange={setShowDetails}>
              <SheetContent side="right" className="w-[90%] bg-luxury-darker border-l border-luxury-primary/20 p-0">
                <ChatDetails 
                  recipient={{
                    id: selectedUserId,
                    username: selectedUserInfo.username,
                    avatar_url: selectedUserInfo.avatar_url
                  }}
                  onClose={() => setShowDetails(false)}
                />
              </SheetContent>
            </Sheet>
          )}
        </div>
      
        <NewMessageDialog
          open={showNewMessageDialog}
          onOpenChange={setShowNewMessageDialog}
          onSelectUser={handleSelectUser}
        />
      </div>
    );
  }
  
  // Render for desktop/tablet
  return (
    <div className="h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Conversations Sidebar */}
        <div className={`${isTablet && selectedUserId ? 'hidden lg:flex' : 'flex'} flex-shrink-0 w-[320px] border-r border-luxury-primary/20 bg-luxury-darker overflow-y-auto`}>
          <ConversationsList 
            onSelectUser={handleSelectUser} 
            onNewMessage={handleNewMessageClick} 
          />
        </div>
        
        {/* Main Chat Area */}
        <div className="flex-grow relative bg-luxury-dark">
          {isTablet && selectedUserId && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-4 left-4 lg:hidden z-10"
              onClick={() => setSelectedUserId(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          
          {selectedUserId ? (
            <ChatWindow
              recipient={{ 
                id: selectedUserId,
                username: selectedUserInfo?.username || "User",
                avatar_url: selectedUserInfo?.avatar_url
              }}
              onToggleDetails={handleToggleDetails}
              onClose={handleBackToList}
            />
          ) : (
            <EmptyChat onNewMessage={handleNewMessageClick} />
          )}
          
          {/* Chat Details Sidebar */}
          {showDetails && selectedUserId && selectedUserInfo && (
            <div className={`absolute top-0 right-0 h-full ${isTablet ? 'w-[280px]' : 'w-[320px]'} bg-luxury-darker border-l border-luxury-primary/20 overflow-y-auto shadow-lg animate-in slide-in-from-right`}>
              <ChatDetails 
                recipient={{
                  id: selectedUserId,
                  username: selectedUserInfo.username,
                  avatar_url: selectedUserInfo.avatar_url
                }}
                onClose={handleToggleDetails}
              />
            </div>
          )}
        </div>
      </div>

      <NewMessageDialog
        open={showNewMessageDialog}
        onOpenChange={setShowNewMessageDialog}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
};

export default Messages;
