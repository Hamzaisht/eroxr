
import { useState, useEffect } from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { 
  getSafeProfile,
  asUserSubscriptionStatus,
  safeDataAccess
} from '@/utils/supabase/helpers';
import { Database } from "@/integrations/supabase/types/database.types";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { safeUserSubscriptionFilter, safeUserSubscriptionUpdate } from '@/utils/supabase/type-guards';

interface ProfileWithSubscriptions {
  id: string;
  username?: string | null;
  is_paying_customer?: boolean | null;
  user_subscriptions?: {
    id: string;
    status: string;
  }[];
}

export const TempDemoContent = () => {
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [lastUsernameChange, setLastUsernameChange] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState("");

  // Fetch user profile with subscriptions
  const { data: profileData } = useQuery({
    queryKey: ['profile-with-subscriptions'],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            user_subscriptions:user_subscriptions(*)
          `)
          .eq("id", session.user.id)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          return null;
        }
        
        return data as unknown as ProfileWithSubscriptions;
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        return null;
      }
    },
    enabled: !!session?.user?.id,
  });

  // Safely access profile data
  const safeProfile = getSafeProfile(profileData);
  
  // Type-safe access to subscription data
  const subscriptions = safeProfile && 'user_subscriptions' in safeProfile ? 
    safeProfile.user_subscriptions as { id: string; status: string }[] : [];

  const handleUnsubscribe = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      // First get the subscription ID
      const [userIdColumn, userIdValue] = safeUserSubscriptionFilter("user_id", session.user.id);
      const [statusColumn, statusValue] = safeUserSubscriptionFilter("status", "active");
      
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq(userIdColumn, userIdValue)
        .eq(statusColumn, statusValue)
        .single();
      
      if (!subscriptionData) {
        console.error("No active subscription found");
        return;
      }
      
      // Update status to inactive
      const updates = safeUserSubscriptionUpdate({ status: "inactive" });
      
      const { error } = await supabase
        .from('user_subscriptions')
        .update(updates)
        .eq("id", subscriptionData.id);
        
      if (error) {
        console.error("Failed to update subscription:", error);
      }
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Temporary Demo Content</h2>
      {session ? (
        <>
          <p>User ID: {session.user.id}</p>
          <p>Email: {session.user.email}</p>
          {safeProfile ? (
            <>
              <p>Username: {safeProfile.username}</p>
              <p>Paying Customer: {safeProfile.is_paying_customer ? 'Yes' : 'No'}</p>
              {subscriptions && subscriptions.length > 0 ? (
                <>
                  <h3>Subscriptions:</h3>
                  <ul>
                    {subscriptions.map((sub) => (
                      <li key={sub.id}>
                        Subscription ID: {sub.id}, Status: {asUserSubscriptionStatus(sub.status)}
                      </li>
                    ))}
                  </ul>
                  <Button onClick={handleUnsubscribe} disabled={loading}>
                    {loading ? 'Unsubscribing...' : 'Unsubscribe'}
                  </Button>
                </>
              ) : (
                <p>No subscriptions found.</p>
              )}
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </>
      ) : (
        <p>Not logged in.</p>
      )}
    </div>
  );
};
