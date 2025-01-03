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
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video w-full overflow-hidden">
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">{subscribers} subscribers</span>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            Subscribe
          </Button>
        </div>
      </div>
    </Card>
  );
};