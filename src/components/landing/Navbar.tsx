
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NavButtons } from "./NavButtons";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { TextDistortion } from "./components/TextDistortion";
import { MagneticButton } from "./components/MagneticButton";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const navRef = useRef<HTMLElement>(null);
  
  // Enhance scroll effects
  const scrollProgress = useTransform(scrollY, [0, 100], [0, 1]);
  const scrollBgOpacity = useTransform(scrollY, [0, 100], [0, 0.9]);
  const scrollBorderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);
  const scrollBlur = useTransform(scrollY, [0, 100], [0, 8]);
  
  // Spring for smoother transitions
  const springScrollProgress = useSpring(scrollProgress, { 
    stiffness: 100, 
    damping: 30 
  });
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const logoVariants = {
    default: { 
      scale: 1,
      filter: "brightness(1)"
    },
    hover: { 
      scale: 1.05,
      filter: "brightness(1.2)",
      transition: { 
        scale: { type: "spring" as const, stiffness: 400, damping: 10 },
        filter: { duration: 0.2 }
      }
    },
    tap: { 
      scale: 0.95
    }
  };
  
  return (
    <motion.nav 
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 py-4 px-4 md:px-6 lg:px-8"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundColor: useTransform(
          springScrollProgress, 
          [0, 1], 
          ["rgba(13, 17, 23, 0)", "rgba(13, 17, 23, 0.9)"]
        ),
        backdropFilter: `blur(${scrollBlur}px)`,
        borderBottom: useTransform(
          springScrollProgress,
          [0, 1],
          ["1px solid rgba(155, 135, 245, 0)", "1px solid rgba(155, 135, 245, 0.1)"]
        ),
        boxShadow: useTransform(
          springScrollProgress,
          [0, 1],
          ["none", "0 10px 30px -10px rgba(0, 0, 0, 0.3)"]
        ),
      }}
    >
      <div className="w-full flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <motion.div
            variants={logoVariants}
            initial="default"
            whileHover="hover"
            whileTap="tap"
            className="relative"
          >
            <TextDistortion
              text="Eroxr"
              className="text-2xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent"
              distortionFactor={3}
              hoverEffect={isHovering}
            />
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: isHovering 
                  ? ["0 0 0px rgba(155, 135, 245, 0)", "0 0 15px rgba(155, 135, 245, 0.5)", "0 0 0px rgba(155, 135, 245, 0)"]
                  : "none"
              }}
              transition={{
                duration: 1.5,
                repeat: isHovering ? Infinity : 0,
                repeatType: "reverse"
              }}
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavButtons />
        </div>

        {/* Mobile Menu Button */}
        <MagneticButton
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          magneticStrength={0.5}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-luxury-primary" />
          ) : (
            <Menu className="w-6 h-6 text-luxury-primary" />
          )}
        </MagneticButton>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div 
          className="md:hidden py-4 mt-4 bg-luxury-darker/90 backdrop-blur-xl border-t border-luxury-primary/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col space-y-4 px-6">
            <NavButtons orientation="vertical" />
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
