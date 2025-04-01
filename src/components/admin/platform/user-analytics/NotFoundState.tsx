
import React from "react";
import { Button } from "@/components/ui/button";

interface NotFoundStateProps {
  onNavigateToUsers: () => void;
}

export const NotFoundState: React.FC<NotFoundStateProps> = ({ onNavigateToUsers }) => {
  return (
    <div className="text-center p-8">
      <h2 className="text-xl font-bold mb-2">User Not Found</h2>
      <p className="text-muted-foreground">
        Could not find analytics data for this user.
      </p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={onNavigateToUsers}
      >
        Back to Users
      </Button>
    </div>
  );
};
