
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NavButtons } from "./NavButtons";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  // Track scrolling to update navbar appearance
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  });

  // Close mobile menu when route changes
  useEffect(() => {
    return () => setIsOpen(false);
  }, [navigate]);

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "py-3 bg-luxury-dark/90 backdrop-blur-xl border-b border-luxury-primary/10 shadow-md" 
          : "py-5 bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 xl:px-0">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Eroxr
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavButtons />
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-luxury-primary" />
            ) : (
              <Menu className="w-6 h-6 text-luxury-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div 
            className="md:hidden py-4 mt-4 bg-luxury-darker/90 backdrop-blur-xl rounded-lg border border-luxury-primary/10 absolute left-4 right-4 z-50 shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-4 px-6 py-4">
              <NavButtons orientation="vertical" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};
