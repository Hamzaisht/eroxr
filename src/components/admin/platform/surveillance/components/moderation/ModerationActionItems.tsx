
import { Ban, Flag, MessageSquare, Trash2, Eye, Edit, Shield, RefreshCw } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { LiveSession, SurveillanceContentItem, ModerationAction } from "../../types";

interface ModerationActionItemsProps {
  session: LiveSession | SurveillanceContentItem;
  onAction: (action: ModerationAction) => void;
  actionInProgress: string | null;
}

export const ModerationActionItems = ({ 
  session, 
  onAction,
  actionInProgress
}: ModerationActionItemsProps) => {
  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuItem
          className="text-blue-400 flex items-center space-x-2"
          onClick={() => onAction('view')}
          disabled={!!actionInProgress}
        >
          <Eye className="h-4 w-4 mr-2" />
          <span>View Content</span>
        </DropdownMenuItem>
        
        {session.content && (
          <DropdownMenuItem
            className="text-green-400 flex items-center space-x-2"
            onClick={() => onAction('edit')}
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
          onClick={() => onAction('flag')}
          disabled={!!actionInProgress}
        >
          <Flag className="h-4 w-4 mr-2" />
          <span>Flag Content</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          className="text-orange-400 flex items-center space-x-2"
          onClick={() => onAction('warn')}
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
          onClick={() => onAction('shadowban')}
          disabled={!!actionInProgress}
        >
          <Shield className="h-4 w-4 mr-2" />
          <span>Shadow Ban</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          className="text-rose-400 flex items-center space-x-2"
          onClick={() => onAction('delete')}
          disabled={!!actionInProgress}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span>Hide Content</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          className="text-red-400 flex items-center space-x-2"
          onClick={() => onAction('ban')}
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
            onClick={() => onAction('restore')}
            disabled={!!actionInProgress}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Restore Content</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem
            className="text-red-400 flex items-center space-x-2 font-bold"
            onClick={() => onAction('force_delete')}
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
