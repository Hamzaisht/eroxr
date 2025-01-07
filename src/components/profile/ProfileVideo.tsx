import { motion } from "framer-motion";

export const ProfileVideo = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto my-8 rounded-2xl overflow-hidden shadow-xl"
    >
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source 
          src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-with-a-black-jacket-posing-in-a-studio-39884-large.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>
    </motion.div>
  );
};