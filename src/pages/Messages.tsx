import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MessageList } from "@/components/messages/MessageList";
import { ChatWindow } from "@/components/messages/ChatWindow";

const Messages = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-[350px,1fr] gap-6">
          <div className="border rounded-lg bg-card">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Messages</h2>
            </div>
            <MessageList onSelectUser={setSelectedUserId} />
          </div>
          <div className="border rounded-lg bg-card">
            {selectedUserId ? (
              <ChatWindow recipientId={selectedUserId} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;