
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, CreditCard, ArrowRightFromLine, CircleUserRound, Dot } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  convertToStatus,
  getSafeProfile
} from "@/utils/supabase/helpers";
import { 
  ProfileStatus,
  toValidProfileStatus
} from "@/utils/supabase/type-guards";
import { AvailabilityStatus } from "@/utils/media/types";
import { AvailabilityIndicator } from "@/components/ui/availability-indicator";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types/database.types";
import { updateProfileStatus } from "@/utils/supabase/db-helpers";
import { isQueryError } from "@/utils/supabase/typeSafeOperations";

// Define proper types for profiles table
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileKey = keyof ProfileRow;

export function UserMenu() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<AvailabilityStatus>(AvailabilityStatus.OFFLINE);
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();
  const supabaseClient = useSupabaseClient();

  // Fetch user profile data with proper typing
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select("*")
          .eq('id' as ProfileKey, session.user.id)
          .maybeSingle();
          
        if (error || !data) {
          console.error('Error fetching profile:', error || 'Invalid data');
          return null;
        }
        
        return data as ProfileRow;
      } catch (error) {
        console.error('Exception fetching profile:', error);
        return null;
      }
    },
    enabled: !!session?.user?.id,
  });

  // Extract profile data safely with better error handling
  const safeProfile = profile ? getSafeProfile(profile) : null;

  // Initialize status from profile data
  useEffect(() => {
    if (safeProfile?.status) {
      setCurrentStatus(convertToStatus(safeProfile.status));
    }
  }, [safeProfile]);

  const signOut = async () => {
    setIsSigningOut(true);
    try {
      await supabaseClient.auth.signOut();
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  const updateUserStatus = async (newStatus: AvailabilityStatus) => {
    if (!session?.user?.id) return;
    
    try {
      // Convert the enum status to a valid database status value
      let dbStatus: ProfileStatus = 'offline';
      
      switch (newStatus) {
        case AvailabilityStatus.ONLINE:
          dbStatus = 'online';
          break;
        case AvailabilityStatus.AWAY:
          dbStatus = 'away';
          break;
        case AvailabilityStatus.BUSY:
          dbStatus = 'busy';
          break;
        case AvailabilityStatus.INVISIBLE:
        case AvailabilityStatus.OFFLINE:
          dbStatus = 'offline';
          break;
      }
      
      await updateProfileStatus(session.user.id, dbStatus);
      
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={safeProfile?.avatar_url || ""} alt={safeProfile?.username || "User"} />
            <AvatarFallback>{safeProfile?.username?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
          </Avatar>
          <AvailabilityIndicator status={currentStatus} className="absolute bottom-0 right-0" onClick={(e) => e.stopPropagation()} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(`/profile/${session?.user?.id}`)}>
          <CircleUserRound className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/subscription")}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Subscription</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} disabled={isSigningOut}>
          <ArrowRightFromLine className="mr-2 h-4 w-4" />
          <span>{isSigningOut ? "Signing Out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
