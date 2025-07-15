
import { SearchBar } from "./SearchBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { PremiumStatusBadge } from "@/components/subscription/PremiumStatusBadge";

export const MainNav = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-luxury-dark/95 backdrop-blur-xl border-b border-luxury-primary/10">
      <div className="flex items-center justify-end h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <SearchBar />
          {user && <PremiumStatusBadge />}
          {user && <NotificationCenter />}
        </div>
      </div>
    </nav>
  );
};
