import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface UserProfileSectionProps {
  isExpanded: boolean;
}

export const UserProfileSection = ({ isExpanded }: UserProfileSectionProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setAvatarUrl(session.user.user_metadata.avatar_url || null);
      setUsername(session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User');
    }
  }, [session]);

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="mt-auto px-4">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start px-2 py-3.5 font-normal">
            <div className="flex items-center gap-2 w-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl || ""} alt={username || "User"} />
                <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {isExpanded && (
                <div className="flex flex-col items-start gap-0 leading-none">
                  <p className="font-semibold text-sm">{username}</p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user.email}
                  </p>
                </div>
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end" forceMount>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsLogoutModalOpen(true)}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
