
import { AlertCircle } from "lucide-react";

export function NearbyTab() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-black/20 rounded-xl min-h-[300px]">
      <AlertCircle className="h-12 w-12 text-luxury-primary/40 mb-4" />
      <h3 className="text-xl font-bold text-luxury-primary mb-2">Location Access Required</h3>
      <p className="text-luxury-neutral/60 max-w-md">
        Enable location access to see profiles near you. This feature helps you find matches in your area.
      </p>
    </div>
  );
}
