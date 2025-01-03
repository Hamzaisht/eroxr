import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CreatorCardProps {
  name: string;
  image: string;
  description: string;
  subscribers: number;
}

export const CreatorCard = ({ name, image, description, subscribers: initialSubscribers }: CreatorCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? `${name} removed from your favorites` : `${name} added to your favorites`,
      duration: 3000,
    });
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    setSubscribers(current => isSubscribed ? current - 1 : current + 1);
    toast({
      title: isSubscribed ? "Unsubscribed" : "Subscribed!",
      description: isSubscribed 
        ? `You have unsubscribed from ${name}` 
        : `You are now subscribed to ${name}! You'll receive updates about new content.`,
      duration: 3000,
    });
  };

  return (
    <Card className="group relative overflow-hidden border-none bg-white/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
      <div className="absolute right-4 top-4 z-10">
        <Button 
          size="icon" 
          variant="ghost" 
          className={`rounded-full backdrop-blur-md transition-all duration-300 ${
            isLiked 
              ? "bg-primary/20 text-primary hover:bg-primary/30" 
              : "bg-white/20 text-white hover:bg-white/40"
          }`}
          onClick={handleLike}
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-primary" : ""}`} />
        </Button>
      </div>
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-xl font-semibold text-transparent">
            {name}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-foreground/70">4.9</span>
          </div>
        </div>
        <p className="text-sm text-foreground/70">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground/60">{subscribers} subscribers</span>
          <Button 
            className={`relative overflow-hidden transition-all hover:scale-105 ${
              isSubscribed 
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-primary to-secondary"
            }`}
            onClick={handleSubscribe}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </div>
      </div>
    </Card>
  );
};