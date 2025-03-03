
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const StatsError = () => {
  return (
    <div className="flex justify-center w-full py-6 px-4">
      <Alert variant="destructive" className="max-w-md bg-luxury-darker border-red-500/20">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load profile stats. Please refresh or try again later.
        </AlertDescription>
      </Alert>
    </div>
  );
};
