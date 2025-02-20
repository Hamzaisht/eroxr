
import { AlertCircle } from "lucide-react";

interface StoryErrorStateProps {
  error: string;
}

export const StoryErrorState = ({ error }: StoryErrorStateProps) => {
  return (
    <div className="w-full h-32 flex items-center justify-center bg-luxury-dark/40 backdrop-blur-md rounded-xl">
      <div className="flex flex-col items-center gap-2 text-red-500">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm">{error}</p>
      </div>
    </div>
  );
};
