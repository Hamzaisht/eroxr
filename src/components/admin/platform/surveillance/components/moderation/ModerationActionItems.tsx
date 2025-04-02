
import { Ban, Flag, MessageSquare, Trash2, Eye, Edit, Shield, RefreshCw } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { LiveSession, ModerationAction } from "../../types";

interface ModerationActionItemsProps {
  onActionClick: (action: ModerationAction) => void;
  actionInProgress: string | null;
  session: LiveSession;
}

export const ModerationActionItems = ({ 
  onActionClick, 
  actionInProgress,
  session
}: ModerationActionItemsProps) => {
  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem
          className="text-blue-400 flex items-center space-x-2"
          onClick={() => onActionClick('view')}
          disabled={!!actionInProgress}
        >
          <Eye className="h-4 w-4 mr-2" />
          <span>View Content</span>
        </DropdownMenuItem>
        
        {session.content && (
          <DropdownMenuItem
            className="text-green-400 flex items-center space-x-2"
            onClick={() => onActionClick('edit')}
            disabled={!!actionInProgress}
          >
            <Edit className="h-4 w-4 mr-2" />
            <span>Edit Content</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuGroup>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuGroup>
        <DropdownMenuItem
          className="text-yellow-400 flex items-center space-x-2"
          onClick={() => onActionClick('flag')}
          disabled={!!actionInProgress}
        >
          <Flag className="h-4 w-4 mr-2" />
          <span>Flag Content</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          className="text-orange-400 flex items-center space-x-2"
          onClick={() => onActionClick('warn')}
          disabled={!!actionInProgress}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          <span>Send Warning</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuGroup>
        <DropdownMenuItem
          className="text-purple-400 flex items-center space-x-2"
          onClick={() => onActionClick('shadowban')}
          disabled={!!actionInProgress}
        >
          <Shield className="h-4 w-4 mr-2" />
          <span>Shadow Ban</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          className="text-rose-400 flex items-center space-x-2"
          onClick={() => onActionClick('delete')}
          disabled={!!actionInProgress}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span>Hide Content</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          className="text-red-400 flex items-center space-x-2"
          onClick={() => onActionClick('ban')}
          disabled={!!actionInProgress}
        >
          <Ban className="h-4 w-4 mr-2" />
          <span>Ban User</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="text-gray-400">
          Advanced Actions
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            className="text-green-400 flex items-center space-x-2"
            onClick={() => onActionClick('restore')}
            disabled={!!actionInProgress}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Restore Content</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            className="text-red-400 flex items-center space-x-2 font-bold"
            onClick={() => onActionClick('force_delete')}
            disabled={!!actionInProgress}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Force Delete</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
};
