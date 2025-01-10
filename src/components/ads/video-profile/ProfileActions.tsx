import { Share2, Flag, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileActionsProps {
  interests?: string[];
}

export const ProfileActions = ({ interests }: ProfileActionsProps) => {
  return (
    <div className="flex items-center justify-between pt-4">
      <div className="flex gap-2">
        {interests?.slice(0, 3).map((interest, index) => (
          <>
            <Badge 
              key={index}
              variant="outline" 
              className="bg-luxury-primary/5 border-luxury-primary/20 text-luxury-neutral"
            >
              {interest}
            </Badge>
            {index < interests.length - 1 && (
              <span className="text-luxury-neutral/20 pointer-events-none select-none">
                |
              </span>
            )}
          </>
        ))}
      </div>
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-luxury-primary hover:text-luxury-primary/80 hover:bg-luxury-primary/10"
        >
          <Share2 className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-luxury-primary hover:text-luxury-primary/80 hover:bg-luxury-primary/10"
        >
          <Flag className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-luxury-primary hover:text-luxury-primary/80 hover:bg-luxury-primary/10"
        >
          <Heart className="h-5 w-5" />
        </Button>
        <Button 
          variant="default"
          className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary text-white"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact
        </Button>
      </div>
    </div>
  );
};