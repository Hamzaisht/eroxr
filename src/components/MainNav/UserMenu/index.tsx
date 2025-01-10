import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { UserBadge } from "./UserBadge";
import { UserAvatar } from "./UserAvatar";
import { GuestButtons } from "./GuestButtons";
import { UserMenuItems } from "./UserMenuItems";
import { useEffect } from "react";
import { AvailabilityStatus } from "@/components/ui/availability-indicator";

export const UserMenu = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  // Set up session refresh handling
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    // Check session on mount
    const checkSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error || !currentSession) {
        navigate('/login');
      }
    };
    
    checkSession();
    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        // First fetch the profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          throw profileError;
        }

        // Then fetch user roles
        const { data: roleData, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (rolesError && rolesError.code !== 'PGRST116') {
          console.error("Roles fetch error:", rolesError);
          throw rolesError;
        }

        // Get the role or default to 'user'
        const userRole = roleData?.role || 'user';

        // Combine the data and ensure status is a valid AvailabilityStatus
        return profileData ? {
          ...profileData,
          role: userRole,
          status: (profileData.status as AvailabilityStatus) || 'offline'
        } : null;
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        return null;
      }
    },
    enabled: !!session?.user?.id,
  });

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/login");
    toast({
      title: "Join our community!",
      description: "Create your account to get started.",
    });
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      navigate("/login");
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      
      if (error.message?.includes('refresh_token_not_found')) {
        // Force sign out on client side if token is invalid
        await supabase.auth.signOut();
        navigate("/login");
        toast({
          title: "Session expired",
          description: "Please log in again.",
          variant: "destructive",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: "Please try again later",
        });
      }
    }
  };

  if (!session || isLoading) {
    return <GuestButtons onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  return (
    <div className="flex items-center gap-4">
      <UserBadge 
        profile={profile} 
        fallbackEmail={session.user.email} 
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserAvatar 
            avatarUrl={session.user.user_metadata.avatar_url}
            email={session.user.email}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <UserMenuItems onLogout={handleLogout} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};