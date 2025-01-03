import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CreatorCardProps {
  name: string;
  image: string;
  description: string;
  subscribers: number;
}

export const CreatorCard = ({ name, image, description, subscribers }: CreatorCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-none bg-white/80 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h3 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-xl font-semibold text-transparent">
          {name}
        </h3>
        <p className="mt-2 text-sm text-foreground/70">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground/60">{subscribers} subscribers</span>
          <Button className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary transition-all hover:scale-105">
            Subscribe
          </Button>
        </div>
      </div>
    </Card>
  );
};