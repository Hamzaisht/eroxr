import { NavLink } from "react-router-dom";
import { Home, Heart, Play } from "lucide-react";
import { motion } from "framer-motion";

export const NavLinks = () => {
  return (
    <nav className="hidden md:flex flex-col items-start space-y-6">
      <NavLink 
        to="/home" 
        className={({ isActive }) => 
          `group flex items-center gap-2 px-4 py-2 w-full rounded-lg transition-all duration-300 hover:bg-luxury-primary/10 ${
            isActive ? 'text-luxury-primary bg-luxury-primary/5' : 'text-white/60'
          }`
        }
      >
        <Home className="w-5 h-5" />
        <motion.span 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          Home
        </motion.span>
      </NavLink>

      <NavLink 
        to="/dating" 
        className={({ isActive }) => 
          `group flex items-center gap-2 px-4 py-2 w-full rounded-lg transition-all duration-300 hover:bg-luxury-primary/10 ${
            isActive ? 'text-luxury-primary bg-luxury-primary/5' : 'text-white/60'
          }`
        }
      >
        <Heart className="w-5 h-5" />
        <motion.span 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          Dating
        </motion.span>
      </NavLink>

      <NavLink 
        to="/shorts" 
        className={({ isActive }) => 
          `group flex items-center gap-2 px-4 py-2 w-full rounded-lg transition-all duration-300 hover:bg-luxury-primary/10 ${
            isActive ? 'text-luxury-primary bg-luxury-primary/5' : 'text-white/60'
          }`
        }
      >
        <Play className="w-5 h-5" />
        <motion.span 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          Shorts
        </motion.span>
      </NavLink>
    </nav>
  );
};