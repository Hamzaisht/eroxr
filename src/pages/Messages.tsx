
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import ConversationsList from "@/components/messages/ConversationsList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { EmptyChat } from "@/components/messages/EmptyChat";
import { NewMessageDialog } from "@/components/messages/NewMessageDialog";
import ChatDetails from "@/components/messages/ChatDetails";
import { useMediaQuery } from "@/hooks/use-mobile";

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
      // On mobile, hide the conversations list when a chat is selected
      const conversationsEl = document.querySelector(".conversations-list");
      const chatWindowEl = document.querySelector(".chat-window");
      
      if (conversationsEl && chatWindowEl) {
        conversationsEl.classList.add("hidden");
        chatWindowEl.classList.remove("hidden");
      }
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
      const conversationsEl = document.querySelector(".conversations-list");
      const chatWindowEl = document.querySelector(".chat-window");
      
      if (conversationsEl && chatWindowEl) {
        conversationsEl.classList.remove("hidden");
        chatWindowEl.classList.add("hidden");
      }
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className="flex h-full">
        <div className="flex-shrink-0 w-[320px] border-r border-luxury-primary/20 bg-luxury-darker overflow-y-auto conversations-list">
          <ConversationsList 
            onSelectUser={handleSelectUser} 
            onNewMessage={handleNewMessageClick} 
          />
        </div>
        
        <div className="flex-grow relative chat-window">
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
          
          {showDetails && selectedUserId && selectedUserInfo && (
            <div className="absolute top-0 right-0 h-full w-[300px] bg-luxury-darker border-l border-luxury-primary/20 overflow-y-auto">
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
