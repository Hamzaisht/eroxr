import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";

interface CreatorCardProps {
  name: string;
  image: string;
  description: string;
  subscribers: number;
}

export const CreatorCard = ({ name, image, description, subscribers }: CreatorCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-none bg-white/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
      <div className="absolute right-4 top-4 z-10">
        <Button size="icon" variant="ghost" className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40">
          <Heart className="h-5 w-5 text-white" />
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
          <Button className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary transition-all hover:scale-105">
            Subscribe
          </Button>
        </div>
      </div>
    </Card>
  );
};