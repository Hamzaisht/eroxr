import { useState } from "react";
import { MessageList } from "@/components/messages/MessageList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { ChatDetails } from "@/components/messages/ChatDetails";
import { NewMessageDialog } from "@/components/messages/NewMessageDialog";
import { cn } from "@/lib/utils";

const Messages = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div className="h-screen bg-luxury-dark">
      <div className="grid h-full grid-cols-[320px,1fr,350px]">
        {/* Left Sidebar - Chat List */}
        <div className="border-r border-luxury-neutral/10 bg-luxury-dark/50">
          <div className="p-4 space-y-4 border-b border-luxury-neutral/10">
            <NewMessageDialog onSelectUser={setSelectedUserId} />
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full h-10 pl-10 pr-4 text-sm bg-luxury-neutral/5 border border-luxury-neutral/10 rounded-lg focus:outline-none focus:border-luxury-primary"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-luxury-neutral/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <MessageList onSelectUser={setSelectedUserId} />
        </div>

        {/* Main Chat Area */}
        <div className={cn(
          "flex flex-col bg-luxury-dark/30",
          !selectedUserId && "items-center justify-center text-luxury-neutral/50"
        )}>
          {selectedUserId ? (
            <ChatWindow 
              recipientId={selectedUserId} 
              onToggleDetails={() => setShowDetails(!showDetails)}
            />
          ) : (
            <div className="text-center">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Chat Details */}
        {showDetails && selectedUserId && (
          <ChatDetails userId={selectedUserId} onClose={() => setShowDetails(false)} />
        )}
      </div>
    </div>
  );
};

export default Messages;