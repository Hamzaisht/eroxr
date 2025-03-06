
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModerationStatus } from "../types";

interface ModerationBadgeProps {
  status: ModerationStatus;
  className?: string;
}

export const ModerationBadge = ({ status, className }: ModerationBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle,
          text: "Approved",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          borderColor: "border-green-200"
        };
      case "rejected":
        return {
          icon: XCircle,
          text: "Rejected",
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          borderColor: "border-red-200"
        };
      case "pending":
      default:
        return {
          icon: Clock,
          text: "Pending Review",
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-700",
          borderColor: "border-yellow-200"
        };
    }
  };

  const { icon: Icon, text, bgColor, textColor, borderColor } = getStatusConfig();

  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border",
      bgColor,
      textColor,
      borderColor,
      className
    )}>
      <Icon className="h-3 w-3" />
      <span>{text}</span>
    </div>
  );
};
