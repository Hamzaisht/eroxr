import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const NavLinks = () => {
  const navigate = useNavigate();
  
  return (
    <div className="hidden md:flex items-center gap-6">
      <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
      <Button variant="ghost">Categories</Button>
      <Button variant="ghost">About</Button>
    </div>
  );
};