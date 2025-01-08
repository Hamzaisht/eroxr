import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
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
import { UserBadge } from "./UserBadge";
import { UserAvatar } from "./UserAvatar";
import { GuestButtons } from "./GuestButtons";
import { Button } from "@/components/ui/button";

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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again later",
      });
    }
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