import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 text-white/60 hover:text-white"
      onClick={() => navigate(-1)}
    >
      <ChevronLeft className="w-4 h-4" />
      <span>Back</span>
    </Button>
  );
};