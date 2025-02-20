
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StoryViewer } from "../types/story-actions";

interface ViewersListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewers: StoryViewer[];
}

export const ViewersList = ({ open, onOpenChange, viewers }: ViewersListProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-gray-900 to-black text-white">
        <DialogHeader>
          <DialogTitle>Story Viewers</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {viewers.map((viewer) => (
            <div key={viewer.id} className="flex items-center gap-3 py-2">
              <Avatar>
                <AvatarImage src={viewer.avatar_url} />
                <AvatarFallback>{viewer.username[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{viewer.username}</p>
                <p className="text-xs text-gray-400">
                  {new Date(viewer.created_at).toLocaleTimeString()}
                  {viewer.action_type !== 'view' && ` • ${viewer.action_type}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
