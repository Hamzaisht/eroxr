import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CreatorActions } from "./creator/CreatorActions";
import { CreatorStats } from "./creator/CreatorStats";

interface CreatorCardProps {
  name: string;
  image: string;
  description: string;
  subscribers: number;
  creatorId: string;
}

export const CreatorCard = ({ 
  name, 
  image, 
  description, 
  subscribers: initialSubscribers,
  creatorId 
}: CreatorCardProps) => {
  const [subscribers, setSubscribers] = useState(initialSubscribers);

  const handleSubscriberChange = (change: number) => {
    setSubscribers(prev => prev + change);
  };

  return (
    <Link to={`/profile/${creatorId}`}>
      <Card className="group relative overflow-hidden border-none bg-white/80 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
        <div className="absolute right-4 top-4 z-10">
          <CreatorActions
            creatorId={creatorId}
            name={name}
            subscribers={subscribers}
            onSubscriberChange={handleSubscriberChange}
          />
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
          </div>
          <p className="text-sm text-foreground/70">{description}</p>
          <CreatorStats subscribers={subscribers} />
        </div>
      </Card>
    </Link>
  );
};