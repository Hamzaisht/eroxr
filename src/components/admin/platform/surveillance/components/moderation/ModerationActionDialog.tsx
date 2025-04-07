
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LiveSession, SurveillanceContentItem, ModerationAction } from "@/types/surveillance";

interface ModerationActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  currentAction: ModerationAction | null;
  session: LiveSession | SurveillanceContentItem;
  editedContent: string;
  setEditedContent: React.Dispatch<React.SetStateAction<string>>;
  actionInProgress: string | null;
}

export function ModerationActionDialog({
  open,
  onOpenChange,
  onConfirm,
  currentAction,
  session,
  editedContent,
  setEditedContent,
  actionInProgress
}: ModerationActionDialogProps) {
  const [pauseDuration, setPauseDuration] = useState('7');
  
  const getActionTitle = () => {
    switch (currentAction) {
      case 'edit':
        return 'Edit Content';
      case 'ban':
        return 'Ban User';
      case 'shadowban': 
        return 'Shadowban User';
      case 'force_delete':
        return 'Permanently Delete Content';
      case 'delete':
        return 'Delete Content';
      case 'restore':
        return 'Restore Content';
      case 'pause':
        return 'Pause Account';
      case 'unpause':
        return 'Unpause Account';
      default:
        return 'Take Action';
    }
  };

  const getActionDescription = () => {
    // Safely get username from session
    let username = 'username' in session ? session.username : 'this user';
    
    // For SurveillanceContentItem, check if creator_username exists
    if ('creator_username' in session && session.creator_username) {
      username = session.creator_username;
    }
    
    switch (currentAction) {
      case 'edit':
        return 'Edit the content below. This will keep a record of the original content.';
      case 'ban':
        return `Are you sure you want to ban ${username}? This will hide all their content.`;
      case 'shadowban':
        return `Are you sure you want to shadowban ${username}? They will still be able to post but their content won't be visible to others.`;
      case 'force_delete':
        return 'This will permanently delete the content from the database and cannot be undone.';
      case 'delete':
        return 'This will hide the content from users but will remain in the database.';
      case 'restore':
        return `Are you sure you want to restore ${username}'s account? Their content will become visible again.`;
      case 'pause':
        return `This will temporarily suspend ${username}'s account for a fixed period. They will not be able to log in or interact with the platform during this time.`;
      case 'unpause':
        return `This will remove the temporary suspension on ${username}'s account. They will be able to log in and interact with the platform again.`;
      default:
        return 'Are you sure you want to continue?';
    }
  };

  const getActionButtonText = () => {
    switch (currentAction) {
      case 'edit':
        return 'Save Changes';
      case 'ban':
        return 'Ban User';
      case 'shadowban':
        return 'Shadowban User';
      case 'force_delete':
        return 'Permanently Delete';
      case 'delete':
        return 'Delete Content';
      case 'restore':
        return 'Restore User';
      case 'pause':
        return `Pause Account for ${pauseDuration} Days`;
      case 'unpause':
        return 'Unpause Account';
      default:
        return 'Confirm';
    }
  };

  const isActionDestructive = () => {
    return ['ban', 'shadowban', 'force_delete', 'delete'].includes(currentAction as string);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getActionTitle()}</DialogTitle>
          <DialogDescription>{getActionDescription()}</DialogDescription>
        </DialogHeader>

        {currentAction === 'edit' && (
          <div className="mt-4 mb-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={6}
              className="w-full"
              placeholder="Edit content here..."
            />
          </div>
        )}
        
        {currentAction === 'pause' && (
          <div className="mt-4 mb-4 space-y-3">
            <Label htmlFor="pause-duration">Select pause duration (days)</Label>
            <Select value={pauseDuration} onValueChange={setPauseDuration}>
              <SelectTrigger id="pause-duration" className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="7">1 week</SelectItem>
                <SelectItem value="14">2 weeks</SelectItem>
                <SelectItem value="30">1 month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={!!actionInProgress}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant={isActionDestructive() ? "destructive" : "default"} 
            onClick={onConfirm}
            disabled={!!actionInProgress}
          >
            {getActionButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
