import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <motion.h1 
      onClick={() => navigate("/")}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="text-2xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent cursor-pointer transition-all duration-300"
    >
      Eroxr
    </motion.h1>
  );
};