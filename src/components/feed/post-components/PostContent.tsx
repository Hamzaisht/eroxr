
import { motion } from "framer-motion";

interface PostContentProps {
  content: string;
  creatorId: string;
}

export const PostContent = ({
  content,
  creatorId,
}: PostContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {content && (
        <p className="text-luxury-neutral/90 leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>
      )}
    </motion.div>
  );
};
