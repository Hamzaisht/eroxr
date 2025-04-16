
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { UniversalMedia } from './UniversalMedia';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';

interface MediaViewerProps {
  media: string | null;
  onClose: () => void;
  creatorId?: string;
}

export const MediaViewer = ({ media, onClose, creatorId }: MediaViewerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    setIsOpen(!!media);
  }, [media]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
    setIsOpen(open);
  };

  if (!media) return null;

  const processedUrl = getPlayableMediaUrl(media);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-black/90 border-luxury-neutral/20">
        <div className="w-full flex items-center justify-center">
          <UniversalMedia
            item={processedUrl || ''}
            className="max-h-[80vh] w-auto"
            controls={true}
            autoPlay={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
