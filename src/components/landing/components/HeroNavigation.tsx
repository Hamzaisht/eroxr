
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { RollingText } from "./RollingText";
import { WaveButton } from "./WaveButton";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface HeroNavigationProps {
  headerBg: any;
}

export const HeroNavigation = ({
  headerBg
}: HeroNavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const navLinks = [
    { name: "Explore", href: "/explore" },
    { name: "Pricing", href: "/pricing" },
    { name: "Creators", href: "/creators" },
  ];
  
  const navVariants = {
    hidden: { 
      opacity: 0,
      y: -20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <>
      <motion.nav 
        style={{
          backgroundColor: headerBg
        }} 
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-200 backdrop-blur-lg border-b border-white/5 w-screen"
        initial="hidden"
        animate="visible"
        variants={navVariants}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between relative z-10">
            <Link to="/" className="flex items-center space-x-2">
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-primary bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Eroxr
              </motion.h1>
            </Link>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button 
                onClick={toggleMobileMenu} 
                className="p-2 rounded-full bg-luxury-dark/50 backdrop-blur-lg border border-white/10"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-luxury-primary" />
                ) : (
                  <Menu className="h-5 w-5 text-luxury-primary" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-8 mr-4">
                {navLinks.map((link) => (
                  <motion.div key={link.name} variants={itemVariants}>
                    <RollingText href={link.href}>{link.name}</RollingText>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.div variants={itemVariants}>
                  <Link to="/login">
                    <WaveButton className="bg-transparent hover:bg-luxury-primary/10 transition-all duration-300">
                      Log In
                    </WaveButton>
                  </Link>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Link to="/register">
                    <WaveButton className="bg-luxury-primary">
                      Sign Up
                    </WaveButton>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 bg-luxury-dark/95 backdrop-blur-lg flex flex-col md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-end p-4">
              <button onClick={toggleMobileMenu} className="p-2">
                <X className="h-6 w-6 text-luxury-primary" />
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center flex-1 space-y-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-2xl font-medium"
                >
                  <Link 
                    to={link.href}
                    onClick={toggleMobileMenu}
                    className="text-white hover:text-luxury-primary transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <div className="mt-10 space-y-4 w-full max-w-xs">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full"
                >
                  <Link 
                    to="/login" 
                    onClick={toggleMobileMenu}
                    className="w-full block text-center py-3 border border-luxury-primary/30 rounded-lg text-white hover:bg-luxury-primary/10 transition-all duration-300"
                  >
                    Log In
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full"
                >
                  <Link 
                    to="/register" 
                    onClick={toggleMobileMenu}
                    className="w-full block text-center py-3 bg-luxury-primary hover:bg-luxury-primary/90 rounded-lg text-white transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </>
  );
};
