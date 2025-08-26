
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileNavigationHelperProps {
  className?: string;
  variant?: "button" | "link";
}

export const ProfileNavigationHelper = ({ 
  className = "",
  variant = "button" 
}: ProfileNavigationHelperProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigateToProfile = (userId?: string) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    } else if (user?.id) {
      navigate(`/profile/${user.id}`);
    } else {
      navigate('/login');
    }
  };

  if (variant === "link") {
    return (
      <div className={`space-y-2 ${className}`}>
        <button
          onClick={() => navigateToProfile()}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
        >
          <User className="w-4 h-4" />
          View My Profile
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Button
        onClick={() => navigateToProfile()}
        className="flex items-center gap-2"
        variant="outline"
      >
        <User className="w-4 h-4" />
        View My Profile
      </Button>
      
      {user?.id && (
        <p className="text-slate-500 text-sm">
          Your profile URL: /profile/{user.id}
        </p>
      )}
    </div>
  );
};
