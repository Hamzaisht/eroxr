
import { Plus } from "lucide-react";

export const StoryUploadButton = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="rounded-full bg-luxury-primary/20 p-2 mb-2">
        <Plus className="h-4 w-4 text-luxury-primary" />
      </div>
      <span className="text-xs text-luxury-primary text-center">
        Add Story
      </span>
    </div>
  );
};
