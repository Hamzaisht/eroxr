
import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onNavigateToUsers: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onNavigateToUsers }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <User className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-bold mb-2">Select a User</h2>
      <p className="text-muted-foreground max-w-md">
        Please select a user from the Users Management tab to view their detailed analytics.
      </p>
      <Button
        variant="outline"
        className="mt-4 bg-[#0D1117]/50"
        onClick={onNavigateToUsers}
      >
        Go to Users Management
      </Button>
    </div>
  );
};
