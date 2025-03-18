
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ValidationErrorsProps {
  errors: string[];
}

export const ValidationErrors = ({ errors }: ValidationErrorsProps) => {
  if (errors.length === 0) return null;
  
  return (
    <Alert variant="destructive" className="mt-3">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="font-semibold mb-1">Please fix the following errors:</div>
        <ul className="list-disc pl-5">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};
