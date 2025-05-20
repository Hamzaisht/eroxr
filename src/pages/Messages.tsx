
import { ChatDetails } from "@/components/messages/ChatDetails";

export default function Messages() {
  // Example otherUserId - in a real app, this would be set based on route params or state
  const otherUserId = "example-user-id";

  return (
    <div className="container h-screen py-8">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="bg-card rounded-lg border shadow-sm h-[calc(100vh-12rem)]">
        <ChatDetails otherUserId={otherUserId} />
      </div>
    </div>
  );
}
