
import { useState } from "react";
import { Ban, Flag, MessageSquare, Trash2, Eye, Edit, MoreVertical, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { SessionModerationActionProps } from "../types";
import { ModerationAction } from "@/types/moderation";

export const ModerationActions = ({ 
  session, 
  onModerate, 
  actionInProgress 
}: SessionModerationActionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ModerationAction | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const handleActionClick = (action: ModerationAction) => {
    if (action === 'edit') {
      setEditedContent(session.content || '');
      setCurrentAction('edit');
      setDialogOpen(true);
    } else if (action === 'ban' || action === 'force_delete') {
      setCurrentAction(action);
      setDialogOpen(true);
    } else {
      onModerate(session, action);
    }
  };

  const handleConfirmAction = () => {
    if (currentAction === 'edit') {
      onModerate(session, 'edit', editedContent);
    } else if (currentAction) {
      onModerate(session, currentAction);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="sm"
            variant="ghost"
            className="bg-red-900/20 hover:bg-red-800/30 text-red-300"
          >
            <span className="sr-only">Moderation menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Moderation Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="text-blue-400 flex items-center space-x-2"
              onClick={() => handleActionClick('view' as ModerationAction)}
              disabled={!!actionInProgress}
            >
              <Eye className="h-4 w-4 mr-2" />
              <span>View Content</span>
            </DropdownMenuItem>
            
            {session.content && (
              <DropdownMenuItem
                className="text-green-400 flex items-center space-x-2"
                onClick={() => handleActionClick('edit')}
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
              onClick={() => handleActionClick('flag')}
              disabled={!!actionInProgress}
            >
              <Flag className="h-4 w-4 mr-2" />
              <span>Flag Content</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem
              className="text-orange-400 flex items-center space-x-2"
              onClick={() => handleActionClick('warn' as ModerationAction)}
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
              onClick={() => handleActionClick('shadowban')}
              disabled={!!actionInProgress}
            >
              <Shield className="h-4 w-4 mr-2" />
              <span>Shadow Ban</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem
              className="text-rose-400 flex items-center space-x-2"
              onClick={() => handleActionClick('delete')}
              disabled={!!actionInProgress}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span>Hide Content</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem
              className="text-red-400 flex items-center space-x-2"
              onClick={() => handleActionClick('ban')}
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
                onClick={() => handleActionClick('restore' as ModerationAction)}
                disabled={!!actionInProgress}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>Restore Content</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem
                className="text-red-400 flex items-center space-x-2 font-bold"
                onClick={() => handleActionClick('force_delete')}
                disabled={!!actionInProgress}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Force Delete</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentAction === 'edit' ? 'Edit Content' : 
               currentAction === 'ban' ? 'Ban User' : 
               currentAction === 'force_delete' ? 'Permanently Delete Content' : 
               'Take Action'}
            </DialogTitle>
            <DialogDescription>
              {currentAction === 'edit' ? 'Edit the content below. This will keep a record of the original content.' : 
               currentAction === 'ban' ? `Are you sure you want to ban ${session.username || 'this user'}? This will hide all their content.` : 
               currentAction === 'force_delete' ? 'This will permanently delete the content from the database and cannot be undone.' : 
               'Are you sure you want to continue?'}
            </DialogDescription>
          </DialogHeader>
          
          {currentAction === 'edit' && (
            <div className="my-4">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={6}
                className="w-full"
                placeholder="Edit content here..."
              />
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            
            <Button 
              variant={currentAction === 'edit' ? 'default' : 'destructive'} 
              onClick={handleConfirmAction}
              disabled={actionInProgress === session.id}
            >
              {actionInProgress === session.id ? 'Processing...' : 
               currentAction === 'edit' ? 'Save Changes' : 
               currentAction === 'ban' ? 'Ban User' : 
               currentAction === 'force_delete' ? 'Permanently Delete' : 
               'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
