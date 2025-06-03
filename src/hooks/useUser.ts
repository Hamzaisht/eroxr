
import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  first_name?: string;
  last_name?: string;
}

export const useUser = () => {
  const session = useSession();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, bio, first_name, last_name')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          // Create a basic user object from session data
          setCurrentUser({
            id: session.user.id,
            username: session.user.email?.split('@')[0] || 'User',
          });
        } else {
          setCurrentUser(data);
        }
      } catch (error) {
        console.error('Unexpected error fetching user profile:', error);
        setCurrentUser({
          id: session.user.id,
          username: session.user.email?.split('@')[0] || 'User',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [session?.user?.id]);

  return { currentUser, isLoading };
};
