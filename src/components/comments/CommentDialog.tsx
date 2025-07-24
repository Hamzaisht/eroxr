import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RealtimeComments } from "./RealtimeComments";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  postContent?: string;
}

export const CommentDialog = ({
  open,
  onOpenChange,
  postId,
  postContent
}: CommentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-luxury-darker border-luxury-primary/20">
        <DialogHeader>
          <DialogTitle className="text-luxury-neutral">
            Comments
          </DialogTitle>
          {postContent && (
            <p className="text-sm text-luxury-neutral/70 line-clamp-2 mt-2">
              {postContent}
            </p>
          )}
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <RealtimeComments postId={postId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};