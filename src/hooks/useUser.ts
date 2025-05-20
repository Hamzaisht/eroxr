
import { useState, useEffect } from "react";
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";

export function useUser() {
  const session = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    
    async function fetchUserProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setUser(data);
        }
      } catch (error) {
        console.error('Unexpected error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [session]);
  
  return { user, loading };
}
