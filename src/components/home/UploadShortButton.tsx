
import { Plus, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const UploadShortButton = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/shorts/upload");
  };
  
  return (
    <div className="fixed bottom-24 right-6 md:bottom-6 z-50">
      <Button
        onClick={handleClick}
        size="lg"
        className="rounded-full h-14 w-14 bg-luxury-primary hover:bg-luxury-primary/80 shadow-lg"
      >
        <Upload className="h-6 w-6" />
      </Button>
    </div>
  );
};
