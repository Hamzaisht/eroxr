
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CreatorActions } from "./creator/CreatorActions";
import { CreatorStats } from "./creator/CreatorStats";
import { CheckCircle } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { AvailabilityIndicator } from "./ui/availability-indicator";
import { AvailabilityStatus } from "@/utils/media/types";
import { useToast } from "./ui/use-toast";

interface CreatorCardProps {
  name: string;
  image: string;
  banner: string;
  description: string;
  subscribers: number;
  creatorId: string;
}

interface PresenceState {
  presence_ref: string;
  status?: AvailabilityStatus;
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
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityStatus>(AvailabilityStatus.OFFLINE);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (!session?.user?.id) return;
      
      const { data: followData } = await supabase
        .from('followers')
        .select('*')
        .eq('follower_id', session.user.id)
        .eq('following_id', creatorId)
        .single();

      setIsFollowing(!!followData);
    };

    const checkSubscriptionStatus = async () => {
      if (!session?.user?.id) return;
      
      const { data: subscriptionData } = await supabase
        .from('creator_subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('creator_id', creatorId)
        .single();

      setIsSubscribed(!!subscriptionData);
    };

    // Subscribe to presence changes
    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const userState = state[creatorId] as PresenceState[];
        
        if (userState && userState.length > 0) {
          const status = userState[0]?.status || AvailabilityStatus.OFFLINE;
          setAvailability(status);
        } else {
          setAvailability(AvailabilityStatus.OFFLINE);
        }
      })
      .subscribe();

    checkFollowingStatus();
    checkSubscriptionStatus();

    // Subscribe to realtime changes for follows and subscriptions
    const followsChannel = supabase
      .channel('follows-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'followers',
          filter: `follower_id=eq.${session?.user?.id} AND following_id=eq.${creatorId}`
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setIsFollowing(false);
          } else if (payload.eventType === 'INSERT') {
            setIsFollowing(true);
          }
        }
      )
      .subscribe();

    const subscriptionsChannel = supabase
      .channel('subscriptions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'creator_subscriptions',
          filter: `user_id=eq.${session?.user?.id} AND creator_id=eq.${creatorId}`
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setIsSubscribed(false);
            setSubscribers(prev => prev - 1);
          } else if (payload.eventType === 'INSERT') {
            setIsSubscribed(true);
            setSubscribers(prev => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(followsChannel);
      supabase.removeChannel(subscriptionsChannel);
    };
  }, [session?.user?.id, creatorId, toast]);

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
            isFollowing={isFollowing}
            isSubscribed={isSubscribed}
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
            <div className="relative h-20 w-20">
              <div className="h-full w-full overflow-hidden rounded-full border-4 border-white">
                <img
                  src={image}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 ring-2 ring-white rounded-full">
                <AvailabilityIndicator status={availability} size={12} />
              </div>
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
