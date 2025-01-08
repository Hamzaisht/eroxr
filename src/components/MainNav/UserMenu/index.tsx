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

export const UserMenu = () => {
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (error) throw error;
      return data;
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
      // First check if we have a valid session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        // If no valid session, just clear local state and redirect
        navigate("/login");
        toast({
          title: "Session expired",
          description: "Please log in again.",
        });
        return;
      }

      // Proceed with logout if we have a valid session
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      
      // Handle specific error cases
      if (error.message?.includes("session_not_found")) {
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

  if (!session) {
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