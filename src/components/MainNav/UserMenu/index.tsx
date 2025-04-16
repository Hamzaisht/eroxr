
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserBadge } from "./UserBadge";
import { GuestButtons } from "./GuestButtons";
import { UserMenuItems } from "./UserMenuItems";
import { UserAvatar } from "@/components/shared/user/UserAvatar";
import { AvailabilityStatus } from "@/components/ui/availability-indicator";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, isLoading, signOut, updateStatus } = useAuth();

  const handleLogin = () => navigate('/login');
  const handleSignUp = () => {
    navigate('/login');
    toast({
      title: "Join our community!",
      description: "Create your account to get started.",
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
    } catch (error: any) {
      console.error("Error during logout:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "Please try again later",
      });
    }
  };

  const handleStatusChange = async (newStatus: AvailabilityStatus) => {
    await updateStatus(newStatus);
  };

  if (!user || isLoading) {
    return <GuestButtons onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  return (
    <div className="flex items-center gap-4">
      <UserBadge 
        profile={profile} 
        fallbackEmail={user.email} 
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <UserAvatar 
              avatarUrl={profile?.avatar_url}
              email={user.email}
              status={profile?.status as AvailabilityStatus}
              onStatusChange={handleStatusChange}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <UserMenuItems onLogout={handleLogout} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
