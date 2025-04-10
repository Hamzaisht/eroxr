
import { AlertCircle } from "lucide-react";

interface ErrorComponentProps {
  message: string;
  className?: string;
}

export const ErrorComponent = ({ message, className = "" }: ErrorComponentProps) => {
  return (
    <div className={`flex flex-col items-center justify-center bg-black/80 p-4 rounded-lg text-center ${className}`}>
      <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
      <p className="text-white/80 text-sm">{message}</p>
    </div>
  );
};
