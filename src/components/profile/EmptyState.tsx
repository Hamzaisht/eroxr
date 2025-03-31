
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState = ({ 
  icon: Icon, 
  message, 
  description, 
  actionLabel,
  actionHref,
  onAction
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-luxury-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-luxury-primary/70" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{message}</h3>
      {description && (
        <p className="text-luxury-neutral max-w-md mb-6">{description}</p>
      )}
      
      {(actionLabel && actionHref) && (
        <Button asChild className="bg-luxury-primary hover:bg-luxury-primary/90">
          <Link to={actionHref}>{actionLabel}</Link>
        </Button>
      )}
      
      {(actionLabel && onAction) && (
        <Button 
          className="bg-luxury-primary hover:bg-luxury-primary/90"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
