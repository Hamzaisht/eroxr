import { useNavigate } from "react-router-dom";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface UserMenuItemsProps {
  onLogout: () => Promise<void>;
}

export const UserMenuItems = ({ onLogout }: UserMenuItemsProps) => {
  const navigate = useNavigate();

  return (
    <>
      <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        onClick={() => navigate("/profile")}
        className="cursor-pointer"
      >
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => navigate("/settings")}
        className="cursor-pointer"
      >
        Settings
      </DropdownMenuItem>
      <DropdownMenuItem 
        onClick={() => navigate("/subscriptions")}
        className="cursor-pointer"
      >
        Subscriptions
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem 
        className="text-red-600 focus:text-red-600 cursor-pointer" 
        onClick={onLogout}
      >
        Sign out of your account
      </DropdownMenuItem>
    </>
  );
};