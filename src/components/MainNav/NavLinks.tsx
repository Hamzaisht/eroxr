import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export const NavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="hidden md:flex items-center gap-6">
      <Button 
        variant={isActive("/home") ? "default" : "ghost"} 
        onClick={() => navigate("/home")}
      >
        Home
      </Button>
      <Button 
        variant={isActive("/categories") ? "default" : "ghost"} 
        onClick={() => navigate("/categories")}
      >
        Categories
      </Button>
      <Button 
        variant={isActive("/about") ? "default" : "ghost"} 
        onClick={() => navigate("/about")}
      >
        About
      </Button>
    </div>
  );
};