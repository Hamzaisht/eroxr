
import { Ban, Flag, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionModerationActionProps } from "../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export const ModerationActions = ({ 
  session, 
  onModerate, 
  actionInProgress 
}: SessionModerationActionProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          size="sm"
          variant="ghost"
          className="bg-red-900/20 hover:bg-red-800/30 text-red-300"
        >
          <span className="sr-only">Open menu</span>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Moderation Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-yellow-400 flex items-center space-x-2"
          onClick={() => onModerate(session, 'flag')}
          disabled={!!actionInProgress}
        >
          <Flag className="h-4 w-4" />
          <span>Flag Content</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-orange-400 flex items-center space-x-2"
          onClick={() => onModerate(session, 'warn')}
          disabled={!!actionInProgress}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Send Warning</span>
        </DropdownMenuItem>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-400 flex items-center space-x-2"
              onSelect={(e) => e.preventDefault()}
            >
              <Ban className="h-4 w-4" />
              <span>Ban User</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ban User</DialogTitle>
              <DialogDescription>
                Are you sure you want to ban {session.username || 'this user'}? This action will remove all their content and block their account.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button 
                variant="destructive" 
                onClick={() => onModerate(session, 'ban')}
                disabled={!!actionInProgress}
              >
                {actionInProgress === session.id ? 'Processing...' : 'Confirm Ban'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
