import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CreatorActions } from "./creator/CreatorActions";
import { CreatorStats } from "./creator/CreatorStats";
import { CheckCircle } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface CreatorCardProps {
  name: string;
  image: string;
  banner: string;
  description: string;
  subscribers: number;
  creatorId: string;
}

export const CreatorCard = ({ 
  name, 
  image, 
  banner,
  description, 
  subscribers: initialSubscribers,
  creatorId 
}: CreatorCardProps) => {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [isFollowing, setIsFollowing] = useState(false);
  const session = useSession();

  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', session.user.id)
        .eq('following_id', creatorId)
        .single();

      if (!error && data) {
        setIsFollowing(true);
      }
    };

    checkFollowingStatus();
  }, [session?.user?.id, creatorId]);

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
        <div className="relative">
          <div className="h-32 w-full overflow-hidden">
            <img
              src={banner}
              alt={`${name}'s banner`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-10 left-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white">
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4 p-6 pt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-xl font-semibold text-transparent">
                {name}
              </h3>
              {isFollowing && (
                <CheckCircle className="h-5 w-5 text-primary" />
              )}
            </div>
          </div>
          <p className="text-sm text-foreground/70">{description}</p>
          <CreatorStats subscribers={subscribers} />
        </div>
      </Card>
    </Link>
  );
};