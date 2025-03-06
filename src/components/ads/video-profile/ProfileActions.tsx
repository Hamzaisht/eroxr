
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Heart, Share2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportAdDialog } from "../body-contact/components/ReportAdDialog";
import { useBodyContactAccess } from "../body-contact/hooks/useBodyContactAccess";

interface ProfileActionsProps {
  userId?: string;
  adId?: string;
  onShare: () => void;
  source: "dating" | "profile";
}

export const ProfileActions = ({ 
  userId, 
  adId,
  onShare,
  source
}: ProfileActionsProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const accessResult = useBodyContactAccess();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleMessageClick = () => {
    if (!session?.user) {
      navigate('/login');
      return;
    }

    if (!accessResult.canAccess) {
      // Show access restriction toast or modal
      return;
    }

    // Navigate to messages with this user pre-selected
    navigate(`/messages?userId=${userId}`);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={handleMessageClick}
          className="flex-1 bg-luxury-primary hover:bg-luxury-primary/80 text-white"
          disabled={!session?.user}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Message
        </Button>
        
        <Button
          variant="outline"
          className="rounded-full aspect-square p-0 w-10 h-10 border-luxury-primary/30 text-luxury-primary"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="rounded-full aspect-square p-0 w-10 h-10 border-luxury-primary/30 text-luxury-primary"
        >
          <Heart className="h-4 w-4" />
        </Button>

        {userId && userId !== session?.user?.id && (
          <Button
            variant="outline"
            className="rounded-full aspect-square p-0 w-10 h-10 border-destructive/30 text-destructive"
            onClick={() => setReportDialogOpen(true)}
          >
            <AlertTriangle className="h-4 w-4" />
          </Button>
        )}
      </div>

      {userId && adId && (
        <ReportAdDialog 
          adId={adId}
          userId={userId}
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
        />
      )}
    </>
  );
};
