
import { AlertCircle, Clock, CheckCircle } from "lucide-react";
import { ModerationStatus as ModerationStatusType } from "../types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ModerationStatusProps {
  status: ModerationStatusType;
}

export const ModerationStatus = ({ status }: ModerationStatusProps) => {
  if (status === "approved") {
    return (
      <Alert className="bg-green-500/10 border-green-500/20">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>Ad Approved</AlertTitle>
        <AlertDescription>
          Your ad has been approved and is now visible to other users.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (status === "rejected") {
    return (
      <Alert className="bg-red-500/10 border-red-500/20">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <AlertTitle>Ad Rejected</AlertTitle>
        <AlertDescription>
          Your ad has been rejected. Please review our community guidelines and make appropriate changes before resubmitting.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Default: pending
  return (
    <Alert className="bg-yellow-500/10 border-yellow-500/20">
      <Clock className="h-4 w-4 text-yellow-500" />
      <AlertTitle>Under Review</AlertTitle>
      <AlertDescription>
        Your ad is currently under review by our moderation team. This typically takes 24-48 hours.
      </AlertDescription>
    </Alert>
  );
};
