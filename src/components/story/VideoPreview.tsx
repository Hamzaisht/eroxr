import { motion } from "framer-motion";

interface VideoPreviewProps {
  videoUrl: string;
}

export const VideoPreview = ({ videoUrl }: VideoPreviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute -top-40 left-1/2 -translate-x-1/2 z-50 w-64 h-96 rounded-xl overflow-hidden shadow-2xl bg-black"
    >
      <video
        src={videoUrl}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </motion.div>
  );
};