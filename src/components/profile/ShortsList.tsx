
import React, { useState } from 'react';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Short } from '@/components/home/types/short';

interface ShortsListProps {
  shorts: Short[];
}

export const ShortsList: React.FC<ShortsListProps> = ({ shorts }) => {
  const [selectedShort, setSelectedShort] = useState<Short | null>(null);
  const [shortErrors, setShortErrors] = useState<Record<string, boolean>>({});

  const handleShortClick = (short: Short) => {
    setSelectedShort(short);
  };

  const handleShortError = (shortId: string) => {
    setShortErrors(prev => ({ ...prev, [shortId]: true }));
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {shorts.map((short) => (
        <div key={short.id} className="relative">
          <img
            src={short.thumbnail}
            alt={`Short ${short.id}`}
            className="w-full h-auto rounded-md cursor-pointer"
            onClick={() => handleShortClick(short)}
          />
          {shortErrors[short.id] && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
              <span className="text-white">Error</span>
            </div>
          )}
        </div>
      ))}

      <Dialog open={!!selectedShort} onOpenChange={() => setSelectedShort(null)}>
        <DialogContent className="sm:max-w-[75%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%]">
          <DialogHeader>
            <DialogTitle>Short Video</DialogTitle>
          </DialogHeader>
          {selectedShort && (
            <VideoPlayer
              url={selectedShort.url}
              poster={selectedShort.thumbnail}
              autoPlay={true}
              showCloseButton={true}
              onClose={() => setSelectedShort(null)}
              onError={() => handleShortError(selectedShort.id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
