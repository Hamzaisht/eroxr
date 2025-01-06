import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <motion.h1 
      onClick={() => navigate("/")}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="text-2xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
    >
      Eroxr
    </motion.h1>
  );
};