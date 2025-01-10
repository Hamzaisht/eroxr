import { FileText } from "lucide-react";

export const EmptyFeed = () => {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="flex justify-center">
        <FileText className="h-12 w-12 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-semibold text-muted-foreground">No posts yet</h3>
      <p className="text-sm text-muted-foreground/80">
        Start following creators or create your own post to see content here!
      </p>
    </div>
  );
};