
import { Loader2 } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-luxury-primary mx-auto" />
        <p className="text-luxury-neutral text-lg">Loading...</p>
      </div>
    </div>
  );
};
