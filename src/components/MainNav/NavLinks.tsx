import { NavLink } from "react-router-dom";
import { Home, Heart, Play, MessageSquare, Film } from "lucide-react";
import { motion } from "framer-motion";

export const NavLinks = () => {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `nav-item-liquid group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-500 ${
            isActive ? 'text-luxury-primary bg-luxury-primary/5' : 'text-white/60'
          }`
        }
      >
        <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
        <motion.span 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          className="overflow-hidden whitespace-nowrap"
        >
          Home
        </motion.span>
      </NavLink>

      <NavLink 
        to="/dating" 
        className={({ isActive }) => 
          `nav-item-liquid group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-500 ${
            isActive ? 'text-luxury-primary bg-luxury-primary/5' : 'text-white/60'
          }`
        }
      >
        <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
        <motion.span 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          className="overflow-hidden whitespace-nowrap"
        >
          Dating
        </motion.span>
      </NavLink>

      <NavLink 
        to="/messages" 
        className={({ isActive }) => 
          `nav-item-liquid group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-500 ${
            isActive ? 'text-luxury-primary bg-luxury-primary/5' : 'text-white/60'
          }`
        }
      >
        <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110" />
        <motion.span 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          className="overflow-hidden whitespace-nowrap"
        >
          Messages
        </motion.span>
      </NavLink>

      <NavLink 
        to="/eroboard" 
        className={({ isActive }) => 
          `nav-item-liquid group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-500 ${
            isActive ? 'text-luxury-primary bg-luxury-primary/5' : 'text-white/60'
          }`
        }
      >
        <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
        <motion.span 
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "auto" }}
          className="overflow-hidden whitespace-nowrap"
        >
          Eroboard
        </motion.span>
      </NavLink>
    </nav>
  );
};