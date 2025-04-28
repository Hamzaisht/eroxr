
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className = "" }: ThemeToggleProps) => {
  const [isDark, setIsDark] = useState(false);
  
  // Check for system preference on mount
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark);
    
    // Listen for changes in system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  
  // Apply theme class to html element
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);
  
  return (
    <motion.button
      className={`relative p-2 rounded-full ${className}`}
      onClick={() => setIsDark(!isDark)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 45 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Moon className="h-[1.2rem] w-[1.2rem] text-white" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem] text-white" />
        )}
      </motion.div>
    </motion.button>
  );
};
