
import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

interface User {
  id: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  is_verified?: boolean;
}

export function useUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const session = useSession();
  const supabase = useSupabaseClient();
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user) {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          throw error;
        }
        
        setCurrentUser({
          id: session.user.id,
          username: data?.username,
          email: session.user.email,
          avatar_url: data?.avatar_url,
          is_verified: data?.is_verified
        });
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [session, supabase]);
  
  return { currentUser, isLoading, error };
}
