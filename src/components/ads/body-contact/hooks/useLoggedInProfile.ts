
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export interface UserProfileInfo {
  id: string;
  full_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
}

export function useLoggedInProfile() {
  const session = useSession();
  const [profile, setProfile] = useState<UserProfileInfo | null>(null);

  const userId = session?.user?.id;

  const { data } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url")
        .eq("id", userId)
        .single();

      if (error) return null;
      return data as UserProfileInfo;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (data) setProfile(data);
  }, [data, userId]);

  return profile;
}
