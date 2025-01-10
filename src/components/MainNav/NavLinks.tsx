import { NavLink } from "react-router-dom";
import { Home, Heart, Play } from "lucide-react";

export const NavLinks = () => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <NavLink 
        to="/home" 
        className={({ isActive }) => 
          `flex items-center gap-2 text-sm font-medium transition-colors hover:text-luxury-primary ${
            isActive ? 'text-luxury-primary' : 'text-white/60'
          }`
        }
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </NavLink>
      <NavLink 
        to="/dating" 
        className={({ isActive }) => 
          `flex items-center gap-2 text-sm font-medium transition-colors hover:text-luxury-primary ${
            isActive ? 'text-luxury-primary' : 'text-white/60'
          }`
        }
      >
        <Heart className="w-4 h-4" />
        <span>Dating</span>
      </NavLink>
      <NavLink 
        to="/shorts" 
        className={({ isActive }) => 
          `flex items-center gap-2 text-sm font-medium transition-colors hover:text-luxury-primary ${
            isActive ? 'text-luxury-primary' : 'text-white/60'
          }`
        }
      >
        <Play className="w-4 h-4" />
        <span>Shorts</span>
      </NavLink>
    </nav>
  );
};