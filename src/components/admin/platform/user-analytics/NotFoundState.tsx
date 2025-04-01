
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface NotFoundStateProps {
  onNavigateToUsers: () => void;
}

export const NotFoundState: React.FC<NotFoundStateProps> = ({ onNavigateToUsers }) => {
  return (
    <div className="text-center p-8 bg-[#161B22]/50 border border-white/10 rounded-lg">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full bg-red-900/20 p-3">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
      </div>
      <h2 className="text-xl font-bold mb-2">User Not Found</h2>
      <p className="text-muted-foreground mb-6">
        Could not find analytics data for this user. They may have been deleted or you might not have access.
      </p>
      <Button
        variant="outline"
        onClick={onNavigateToUsers}
        className="bg-[#0D1117]/70 hover:bg-[#0D1117]"
      >
        Back to Users
      </Button>
    </div>
  );
};
