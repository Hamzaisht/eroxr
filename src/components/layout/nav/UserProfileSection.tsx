
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AvailabilityIndicator, AvailabilityStatus } from "@/components/ui/availability-indicator";

interface UserProfileSectionProps {
  isExpanded: boolean;
}

export const UserProfileSection = ({ isExpanded }: UserProfileSectionProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityStatus>('online');
  const session = useSession();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      // Fetch user profile data
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, status')
          .eq('id', session.user.id)
          .single();

        if (data) {
          setUsername(data.username);
          setAvailability((data.status as AvailabilityStatus) || 'offline');
        } else {
          // Fallback to email username if no profile found
          setUsername(session.user.email?.split('@')[0] || 'User');
        }
      };

      fetchProfile();
      setAvatarUrl(session.user.user_metadata.avatar_url || null);
    }
  }, [session, supabase]);

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleProfileClick = () => {
    if (username) {
      navigate(`/profile/${username}`);
    }
  };

  const handleAvailabilityChange = async (newStatus: AvailabilityStatus) => {
    setAvailability(newStatus);
    
    // Update status in database
    if (session?.user) {
      await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', session.user.id);
    }
  };

  return (
    <div className="mt-auto px-4">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-start px-2 py-3.5 font-normal hover:bg-white/5"
            onClick={handleProfileClick}
          >
            <div className="flex items-center gap-2 w-full">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl || ""} alt={username || "User"} />
                  <AvatarFallback>{username?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1">
                  <AvailabilityIndicator 
                    status={availability}
                    size={12}
                    className="ring-2 ring-gray-900"
                  />
                </div>
              </div>
              {isExpanded && (
                <div className="flex flex-col items-start gap-0 leading-none min-w-0 flex-1">
                  <p className="font-semibold text-sm text-white truncate">
                    @{username || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {availability}
                  </p>
                </div>
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end" forceMount>
          <DropdownMenuItem onClick={handleProfileClick}>
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAvailabilityChange('online')}>
            <AvailabilityIndicator status="online" className="mr-2" size={8} />
            Online
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAvailabilityChange('away')}>
            <AvailabilityIndicator status="away" className="mr-2" size={8} />
            Away
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAvailabilityChange('busy')}>
            <AvailabilityIndicator status="busy" className="mr-2" size={8} />
            Busy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAvailabilityChange('offline')}>
            <AvailabilityIndicator status="offline" className="mr-2" size={8} />
            Offline
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsLogoutModalOpen(true)}>
            <LogOut className="mr-2 h-4 w-4" />
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
