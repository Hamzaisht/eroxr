
import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-luxury-dark">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 animate-spin text-luxury-primary mb-4" />
        <p className="text-luxury-neutral text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
