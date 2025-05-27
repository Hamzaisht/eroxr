
import ConversationsList from "@/components/messages/ConversationsList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { useState } from "react";

const Messages = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleNewMessage = () => {
    // Handle new message creation
    console.log("New message clicked");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
        <p className="text-gray-400">Stay connected with your conversations</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <div className="md:col-span-1">
          <ConversationsList 
            onSelectUser={handleSelectUser}
            onNewMessage={handleNewMessage}
          />
        </div>
        <div className="md:col-span-2">
          {selectedUserId ? (
            <ChatWindow userId={selectedUserId} />
          ) : (
            <div className="flex items-center justify-center h-full bg-luxury-darker rounded-lg">
              <p className="text-gray-400">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
