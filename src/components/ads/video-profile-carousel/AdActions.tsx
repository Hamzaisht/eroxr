
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatingAd } from "@/types/dating";

interface AdActionsProps {
  ad: DatingAd;
}

export const AdActions = ({ ad }: AdActionsProps) => {
  return (
    <div className="absolute bottom-20 right-4 flex flex-col gap-3">
      <Button size="icon" variant="ghost" className="bg-white/10 text-white hover:bg-white/20 h-10 w-10 rounded-full">
        <Heart className="h-5 w-5" />
      </Button>
      
      <Button size="icon" variant="ghost" className="bg-white/10 text-white hover:bg-white/20 h-10 w-10 rounded-full">
        <MessageCircle className="h-5 w-5" />
      </Button>
      
      <Button size="icon" variant="ghost" className="bg-white/10 text-white hover:bg-white/20 h-10 w-10 rounded-full">
        <Share2 className="h-5 w-5" />
      </Button>
      
      {ad.views || ad.view_count ? (
        <div className="text-xs text-white/70 text-center mt-1">
          {(ad.views || ad.view_count || 0).toLocaleString()} views
        </div>
      ) : null}
    </div>
  );
};
