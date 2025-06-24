
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./button";

export const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // If we're on a profile page and came from a problematic route, go to home instead
    if (location.pathname.includes('new-profile') && window.history.length <= 1) {
      navigate('/home');
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 text-white/60 hover:text-white"
      onClick={handleBack}
    >
      <ChevronLeft className="w-4 h-4" />
      <span>Back</span>
    </Button>
  );
};
