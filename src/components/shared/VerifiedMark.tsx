
import { Shield, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedMarkProps {
  className?: string;
  type?: "shield" | "checkmark";
}

export const VerifiedMark = ({ className, type = "checkmark" }: VerifiedMarkProps) => {
  return (
    <div 
      className={cn(
        "inline-flex items-center justify-center text-blue-500", 
        className
      )}
    >
      {type === "shield" ? (
        <Shield className="h-4 w-4" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
    </div>
  );
};

export default VerifiedMark;
