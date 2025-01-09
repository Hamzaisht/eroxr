import { motion } from "framer-motion";
import { NavButtons } from "./NavButtons";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 w-full z-50 bg-luxury-dark/80 backdrop-blur-lg border-b border-luxury-neutral/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent"
        >
          Eroxr
        </motion.div>

        {/* Mobile menu button */}
        {isMobile && (
          <button
            onClick={toggleMenu}
            className="p-2 text-luxury-neutral/80 hover:text-luxury-neutral"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* Desktop navigation */}
        {!isMobile && (
          <>
            <div className="hidden md:flex items-center gap-8 text-luxury-neutral/80">
              <a href="#features" className="relative group">
                <span className="hover:text-luxury-neutral transition-colors">Features</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-luxury-primary to-luxury-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
              <a href="#safety" className="relative group">
                <span className="hover:text-luxury-neutral transition-colors">Safety</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-luxury-primary to-luxury-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
              <a href="#verification" className="relative group">
                <span className="hover:text-luxury-neutral transition-colors">Verification</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-luxury-primary to-luxury-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            </div>
            <NavButtons />
          </>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-16 left-0 right-0 bg-luxury-dark/95 backdrop-blur-lg border-b border-luxury-neutral/10"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a
              href="#features"
              className="text-luxury-neutral/80 hover:text-luxury-neutral py-2"
              onClick={toggleMenu}
            >
              Features
            </a>
            <a
              href="#safety"
              className="text-luxury-neutral/80 hover:text-luxury-neutral py-2"
              onClick={toggleMenu}
            >
              Safety
            </a>
            <a
              href="#verification"
              className="text-luxury-neutral/80 hover:text-luxury-neutral py-2"
              onClick={toggleMenu}
            >
              Verification
            </a>
            <div className="pt-4 border-t border-luxury-neutral/10">
              <NavButtons />
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};