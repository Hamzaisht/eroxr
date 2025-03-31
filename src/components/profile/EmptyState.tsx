
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title,
  description,
  icon: Icon,
  message,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-luxury-darker rounded-lg">
      <div className="bg-luxury-dark/50 p-4 rounded-full mb-4">
        {typeof Icon === 'string' ? (
          <div className="text-4xl">{Icon}</div>
        ) : (
          <Icon className="h-8 w-8 text-luxury-neutral" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {title || message || "Nothing to see here"}
      </h3>
      {description && <p className="text-luxury-neutral max-w-md mb-6">{description}</p>}
      
      {actionLabel && (
        <>
          {actionHref ? (
            <Link to={actionHref}>
              <Button
                variant="default"
                className="bg-luxury-primary hover:bg-luxury-primary/90"
              >
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button
              variant="default"
              className="bg-luxury-primary hover:bg-luxury-primary/90"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
