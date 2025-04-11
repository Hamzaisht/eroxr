
import { AlertCircle } from "lucide-react";

interface ErrorComponentProps {
  message: string;
  className?: string;
}

export const ErrorComponent = ({ message, className = "" }: ErrorComponentProps) => {
  return (
    <div className={`flex flex-col items-center justify-center p-4 bg-black/20 rounded-md ${className}`}>
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-sm text-center text-red-100">{message}</p>
    </div>
  );
};
