
import { Plus, Upload } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UploadShortButtonProps {
  onUploadClick?: () => void;
}

export const UploadShortButton = ({ onUploadClick }: UploadShortButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Determine the correct navigation path based on current location
  const getUploadPath = () => {
    if (location.pathname.includes('/eros')) {
      return '/eros/upload';
    }
    return '/shorts/upload';
  };
  
  const handleClick = () => {
    if (onUploadClick) {
      onUploadClick();
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload videos",
        variant: "destructive",
      });
      navigate("/login", { state: { from: getUploadPath() } });
    } else {
      navigate(getUploadPath());
    }
  };
  
  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="rounded-full h-14 w-14 bg-luxury-primary hover:bg-luxury-primary/80 shadow-lg"
    >
      <Upload className="h-6 w-6" />
    </Button>
  );
};
