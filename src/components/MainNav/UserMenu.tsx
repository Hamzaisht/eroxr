import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

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

      navigate("/login");
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

  const getUserType = () => {
    if (!profile) return "Guest";
    if (profile.id_verification_status === "verified" && profile.is_paying_customer) {
      return "Verified Creator • Premium";
    }
    if (profile.is_paying_customer) {
      return "Premium User";
    }
    return "Free User";
  };

  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          onClick={handleLogin}
          className="hover:bg-luxury-neutral/10 transition-all duration-300"
        >
          Log in
        </Button>
        <Button 
          onClick={handleSignUp}
          className="bg-button-gradient hover:bg-hover-gradient text-white transition-all duration-300 hover:scale-105"
        >
          Sign up
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium">
          @{profile?.username || session.user.email?.split('@')[0] || 'Guest'}
        </span>
        <Badge 
          variant={profile?.is_paying_customer ? "default" : "secondary"}
          className="text-xs"
        >
          {getUserType()}
        </Badge>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={session.user.user_metadata.avatar_url} 
                alt={session.user.email} 
              />
              <AvatarFallback className="bg-primary/10">
                {session.user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/subscriptions")}>
            Subscriptions
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600" 
            onClick={handleLogout}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};