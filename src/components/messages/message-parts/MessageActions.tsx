
import { MoreVertical, Flag, Trash, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export interface MessageActionsProps {
  isOwnMessage: boolean;
  isVisible: boolean;
  toggleVisibility: () => void;
  onReport?: () => Promise<void>;
  onDelete?: () => Promise<void>;
  onEdit?: () => void;
  onActionClick?: (action: string) => void;
}

export const MessageActions = ({ 
  isOwnMessage, 
  isVisible, 
  toggleVisibility,
  onReport,
  onDelete,
  onEdit,
  onActionClick
}: MessageActionsProps) => {
  const handleAction = (action: string) => {
    if (onActionClick) {
      onActionClick(action);
    } else {
      switch (action) {
        case 'report':
          onReport?.();
          break;
        case 'delete':
          onDelete?.();
          break;
        case 'edit':
          onEdit?.();
          break;
      }
    }
  };
  
  return (
    <div className={`absolute ${isOwnMessage ? 'left-0' : 'right-0'} bottom-0`}>
      <DropdownMenu open={isVisible} onOpenChange={toggleVisibility}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-300">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isOwnMessage ? "start" : "end"} className="bg-gray-800 border-gray-700">
          {isOwnMessage ? (
            <>
              <DropdownMenuItem 
                className="text-gray-300 hover:text-white cursor-pointer"
                onClick={() => handleAction('edit')}
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-400 hover:text-red-300 cursor-pointer"
                onClick={() => handleAction('delete')}
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem 
              className="text-orange-400 hover:text-orange-300 cursor-pointer"
              onClick={() => handleAction('report')}
            >
              <Flag className="mr-2 h-4 w-4" />
              <span>Report</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
