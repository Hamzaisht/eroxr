import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
        <p className="text-luxury-neutral">Loading your experience...</p>
      </div>
    </div>
  );
};