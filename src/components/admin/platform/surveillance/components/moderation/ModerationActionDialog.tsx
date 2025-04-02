
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LiveSession, ModerationAction } from "../../types";

interface ModerationActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  currentAction: ModerationAction | null;
  session: LiveSession;
  editedContent: string;
  setEditedContent: (content: string) => void;
  actionInProgress: string | null;
}

export const ModerationActionDialog = ({
  open,
  onOpenChange,
  onConfirm,
  currentAction,
  session,
  editedContent,
  setEditedContent,
  actionInProgress
}: ModerationActionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          
          <Button 
            variant={currentAction === 'edit' ? 'default' : 'destructive'} 
            onClick={onConfirm}
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
  );
};
