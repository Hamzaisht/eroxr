import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getEnlargedImageStyles } from "@/lib/image-utils";

interface MediaViewerProps {
  media: string | null;
  onClose: () => void;
}

export const MediaViewer = ({ media, onClose }: MediaViewerProps) => {
  if (!media) return null;

  return (
    <Dialog open={!!media} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <img
              src={media}
              alt="Enlarged media"
              className="max-w-full max-h-[95vh] object-contain"
              style={getEnlargedImageStyles()}
            />
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};