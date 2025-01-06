import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CreatorActions } from "./creator/CreatorActions";
import { CreatorStats } from "./creator/CreatorStats";
import { motion } from "framer-motion";

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
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="group relative overflow-hidden border-none bg-gradient-to-br from-luxury-dark/90 to-luxury-dark/70 backdrop-blur-lg shadow-xl">
          <div className="absolute right-4 top-4 z-10">
            <CreatorActions
              creatorId={creatorId}
              name={name}
              subscribers={subscribers}
              onSubscriberChange={handleSubscriberChange}
            />
          </div>
          <div className="aspect-[4/3] w-full overflow-hidden">
            <motion.img
              src={image}
              alt={name}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/80 to-transparent" />
          </div>
          <motion.div 
            className="space-y-4 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-xl font-bold text-transparent">
                {name}
              </h3>
            </div>
            <p className="text-sm text-luxury-neutral/80">{description}</p>
            <CreatorStats subscribers={subscribers} />
          </motion.div>
        </Card>
      </motion.div>
    </Link>
  );
};