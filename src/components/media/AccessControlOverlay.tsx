
import { Lock, Users, CreditCard, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessControlOverlayProps } from "@/utils/media/types";
import { useGhostMode } from "@/hooks/useGhostMode";

export const AccessControlOverlay = ({
  accessLevel,
  creatorHandle,
  ppvAmount,
  isBlurred = true,
  onUnlock,
  onSubscribe,
  onPurchase
}: AccessControlOverlayProps) => {
  const { isGhostMode } = useGhostMode();

  // In ghost mode, show a minimal indicator
  if (isGhostMode) {
    return (
      <div className="absolute top-2 right-2 z-50 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs text-white border border-purple-500/30 shadow-lg flex items-center space-x-1">
        <Eye className="h-3.5 w-3.5 text-purple-400" />
        <span>Ghost Mode</span>
      </div>
    );
  }

  const getOverlayContent = () => {
    switch (accessLevel) {
      case 'subscribers_only':
        return {
          icon: <Users className="w-8 h-8 text-blue-500" />,
          title: "Subscribers Only",
          description: `Subscribe to @${creatorHandle || 'creator'} to unlock this content`,
          actionText: "Subscribe",
          onAction: onSubscribe
        };
      case 'ppv':
        return {
          icon: <CreditCard className="w-8 h-8 text-green-500" />,
          title: "Premium Content",
          description: `Unlock this content for $${ppvAmount || 0}`,
          actionText: `Purchase ($${ppvAmount || 0})`,
          onAction: onPurchase
        };
      case 'private':
        return {
          icon: <Lock className="w-8 h-8 text-red-500" />,
          title: "Private Content",
          description: "This content is private",
          actionText: "Request Access",
          onAction: onUnlock
        };
      default:
        return null;
    }
  };

  const overlayContent = getOverlayContent();
  if (!overlayContent) return null;

  return (
    <div className={`absolute inset-0 flex items-center justify-center z-40 ${
      isBlurred ? 'backdrop-blur-md bg-black/50' : 'bg-black/70'
    }`}>
      <div className="text-center p-6 max-w-sm">
        <div className="mb-4 flex justify-center">
          {overlayContent.icon}
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">
          {overlayContent.title}
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          {overlayContent.description}
        </p>
        {overlayContent.onAction && (
          <Button
            onClick={overlayContent.onAction}
            className="bg-luxury-primary hover:bg-luxury-primary/90 text-white"
          >
            {overlayContent.actionText}
          </Button>
        )}
      </div>
    </div>
  );
};
