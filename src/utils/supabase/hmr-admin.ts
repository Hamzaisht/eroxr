
import { supabase } from "@/integrations/supabase/client";

export const refreshRealtimeSubscriptions = () => {
  try {
    // Re-subscribe to needed channels in dev mode
    const channels = supabase.getChannels();
    
    // Remove existing channels
    channels.forEach(channel => {
      supabase.removeChannel(channel);
    });
    
    // Re-add the channels
    supabase.channel('public:profiles')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        payload => {
          console.log('Profile change:', payload);
      })
      .subscribe();
      
    supabase.channel('public:posts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' }, 
        payload => {
          console.log('Post change:', payload);
      })
      .subscribe();
      
    console.log("Refreshed Supabase realtime subscriptions");
  } catch (e) {
    console.error("Failed to refresh realtime subscriptions:", e);
  }
};
