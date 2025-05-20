
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessageButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const MessageButton = ({ onClick, disabled }: MessageButtonProps) => {
  return (
    <Button 
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="bg-luxury-primary/20 hover:bg-luxury-primary/30 text-luxury-primary h-8"
    >
      <MessageCircle className="h-4 w-4 mr-1" />
      <span>Message</span>
    </Button>
  );
};
