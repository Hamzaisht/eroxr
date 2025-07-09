
import { SearchBar } from "./SearchBar";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export const MainNav = () => {
  const navigate = useNavigate();
  const session = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-luxury-dark/95 backdrop-blur-xl border-b border-luxury-primary/10">
      <div className="flex items-center justify-end h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <SearchBar />
          {session && <NotificationCenter />}
        </div>
      </div>
    </nav>
  );
};
