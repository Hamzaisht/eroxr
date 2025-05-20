
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const ViewButton = ({ onClick, disabled }: ViewButtonProps) => {
  return (
    <Button 
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 h-8"
    >
      <Eye className="h-4 w-4 mr-1" />
      <span>View</span>
    </Button>
  );
};
