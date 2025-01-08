import { motion } from "framer-motion";
import { NordicMap } from "./NordicMap";

export const BackgroundEffects = () => {
  return (
    <>
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      <div className="fixed inset-0 bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark opacity-90" />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <NordicMap />
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="fixed -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-luxury-primary/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1],
          x: [0, -20, 0],
          y: [0, 20, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
        className="fixed -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-luxury-accent/20 blur-3xl"
      />
    </>
  );
};