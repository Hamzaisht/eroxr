
import { motion } from "framer-motion";

export const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ width: "100%", height: "100%" }}>
      <div className="absolute inset-0 w-full h-full bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_80%)] opacity-5" />
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-luxury-dark/50 via-luxury-darker/30 to-luxury-dark/50" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.1) 0%, rgba(76, 29, 149, 0) 50%)`,
        }}
      />
    </div>
  );
};
