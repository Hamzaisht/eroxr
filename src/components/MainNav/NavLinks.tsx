import { NavLink } from "react-router-dom";

export const NavLinks = () => {
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <NavLink 
        to="/home" 
        className={({ isActive }) => 
          `text-sm hover:text-white transition-colors ${isActive ? 'text-white' : 'text-white/60'}`
        }
      >
        Home
      </NavLink>
      <NavLink 
        to="/dating" 
        className={({ isActive }) => 
          `text-sm hover:text-white transition-colors ${isActive ? 'text-white' : 'text-white/60'}`
        }
      >
        Dating
      </NavLink>
      <NavLink 
        to="/shorts" 
        className={({ isActive }) => 
          `text-sm hover:text-white transition-colors ${isActive ? 'text-white' : 'text-white/60'}`
        }
      >
        Shorts
      </NavLink>
    </nav>
  );
};