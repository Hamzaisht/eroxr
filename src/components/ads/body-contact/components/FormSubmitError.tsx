
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FormSubmitErrorProps {
  error: string;
}

export const FormSubmitError = ({ error }: FormSubmitErrorProps) => {
  // Extract and display helpful information for different error types
  const getErrorDetails = () => {
    if (error.includes("moderation_status")) {
      return {
        title: "Database Schema Error",
        description: "The moderation_status column is missing in the dating_ads table. Please run the SQL migration to update the database schema.",
      };
    }
    
    if (error.includes("permission denied")) {
      return {
        title: "Permission Error",
        description: "You don't have permission to create ads. This might be due to Row Level Security policies.",
      };
    }
    
    if (error.includes("not-null constraint")) {
      return {
        title: "Missing Required Fields",
        description: "Some required fields are missing. Please check the form and try again.",
      };
    }
    
    return {
      title: "Creation Error",
      description: error || "Failed to create body contact ad. Please try again.",
    };
  };
  
  const errorDetails = getErrorDetails();
  
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{errorDetails.title}</AlertTitle>
      <AlertDescription>
        {errorDetails.description}
      </AlertDescription>
    </Alert>
  );
};
