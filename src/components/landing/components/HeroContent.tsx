
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { WaveButton } from "./WaveButton";

export const HeroContent = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Connect With Your Audience
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-luxury-neutral max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Join the platform where creators and fans connect through exclusive content, 
              live streams, and meaningful interactions.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link to="/register">
                <WaveButton className="bg-luxury-primary w-full sm:w-auto">
                  Start Creating
                </WaveButton>
              </Link>
              <Link to="/about">
                <WaveButton className="bg-transparent border-2 border-white w-full sm:w-auto">
                  Learn More
                </WaveButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
