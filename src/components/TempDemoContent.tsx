import { useState } from 'react';
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

export const TempDemoContent = () => {
  const session = useSession();
  const [loading, setLoading] = useState(false);

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
          .eq("id" as keyof Database["public"]["Tables"]["profiles"]["Row"], session.user.id)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          return null;
        }
        
        return data;
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
    safeProfile.user_subscriptions : [];

  const handleUnsubscribe = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      // First get the subscription ID
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq("user_id" as keyof Database["public"]["Tables"]["user_subscriptions"]["Row"], session.user.id)
        .eq("status" as keyof Database["public"]["Tables"]["user_subscriptions"]["Row"], "active")
        .single();
      
      if (!subscriptionData) {
        console.error("No active subscription found");
        return;
      }
      
      // Update status to inactive
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ status: "inactive" })
        .eq("id" as keyof Database["public"]["Tables"]["user_subscriptions"]["Row"], subscriptionData.id);
        
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
                    {subscriptions.map((sub: any) => (
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
