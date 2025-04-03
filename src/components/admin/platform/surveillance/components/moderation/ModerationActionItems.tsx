
import { 
  Ban, Flag, MessageSquare, Trash2, 
  Eye, Edit, Shield, RefreshCw, Pause, Play 
} from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LiveSession } from "../../types";
import { SurveillanceContentItem } from "@/types/surveillance";
import { ModerationAction } from "@/types/moderation";

interface ModerationActionItemsProps {
  session: LiveSession | SurveillanceContentItem;
  onAction: (action: ModerationAction) => void;
  actionInProgress: string | null;
}

export function ModerationActionItems({
  session,
  onAction,
  actionInProgress
}: ModerationActionItemsProps) {
  // Helper to check if user is paused
  const isUserPaused = (): boolean => {
    if ('is_paused' in session) {
      return !!session.is_paused;
    }
    return false;
  };

  return (
    <>
      <DropdownMenuItem
        className="text-blue-400 flex items-center space-x-2"
        onClick={() => onAction('view')}
        disabled={!!actionInProgress}
      >
        <Eye className="h-4 w-4 mr-2" />
        <span>View Details</span>
      </DropdownMenuItem>
      
      {/* Show edit only for content with editable fields */}
      {'content' in session && (
        <DropdownMenuItem
          className="text-green-400 flex items-center space-x-2"
          onClick={() => onAction('edit')}
          disabled={!!actionInProgress}
        >
          <Edit className="h-4 w-4 mr-2" />
          <span>Edit Content</span>
        </DropdownMenuItem>
      )}
      
      <DropdownMenuItem
        className="text-yellow-400 flex items-center space-x-2"
        onClick={() => onAction('flag')}
        disabled={!!actionInProgress}
      >
        <Flag className="h-4 w-4 mr-2" />
        <span>Flag</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem
        className="text-orange-400 flex items-center space-x-2"
        onClick={() => onAction('warn')}
        disabled={!!actionInProgress}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        <span>Send Warning</span>
      </DropdownMenuItem>
      
      {!isUserPaused() ? (
        <DropdownMenuItem
          className="text-amber-400 flex items-center space-x-2"
          onClick={() => onAction('pause')}
          disabled={!!actionInProgress}
        >
          <Pause className="h-4 w-4 mr-2" />
          <span>Pause Account</span>
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem
          className="text-green-400 flex items-center space-x-2"
          onClick={() => onAction('unpause')}
          disabled={!!actionInProgress}
        >
          <Play className="h-4 w-4 mr-2" />
          <span>Unpause Account</span>
        </DropdownMenuItem>
      )}
      
      <DropdownMenuItem
        className="text-purple-400 flex items-center space-x-2"
        onClick={() => onAction('shadowban')}
        disabled={!!actionInProgress}
      >
        <Shield className="h-4 w-4 mr-2" />
        <span>Shadowban</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem
        className="text-rose-400 flex items-center space-x-2"
        onClick={() => onAction('delete')}
        disabled={!!actionInProgress}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        <span>Delete</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem
        className="text-red-400 flex items-center space-x-2"
        onClick={() => onAction('ban')}
        disabled={!!actionInProgress}
      >
        <Ban className="h-4 w-4 mr-2" />
        <span>Ban User</span>
      </DropdownMenuItem>
      
      <DropdownMenuItem
        className="text-green-400 flex items-center space-x-2"
        onClick={() => onAction('restore')}
        disabled={!!actionInProgress}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        <span>Restore</span>
      </DropdownMenuItem>
    </>
  );
}
