import { motion } from "framer-motion";
import { NavButtons } from "./NavButtons";

export const Navbar = () => {
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
      </div>
    </nav>
  );
};