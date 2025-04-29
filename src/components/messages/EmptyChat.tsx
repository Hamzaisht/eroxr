
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyChatProps {
  onNewMessage: () => void;
}

export const EmptyChat = ({ onNewMessage }: EmptyChatProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="bg-luxury-dark/30 p-8 rounded-xl max-w-sm flex flex-col items-center">
        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-luxury-primary/20 mb-4">
          <PenSquare className="h-8 w-8 text-luxury-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No conversation selected</h2>
        <p className="text-luxury-neutral mb-6">
          Select an existing conversation or start a new message
        </p>
        <Button onClick={onNewMessage}>
          Start a new message
        </Button>
      </div>
    </div>
  );
};

export default EmptyChat;
