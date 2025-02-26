
import { motion } from "framer-motion";

export const Counter = ({ value }: { value: number }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {value.toLocaleString()}
    </motion.span>
  );
};
