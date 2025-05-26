
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

interface Short {
  id: string;
  title: string;
  thumbnailUrl?: string;
  videoUrl: string;
  views: number;
}

interface ShortsListProps {
  shorts: Short[];
}

export const ShortsList = ({ shorts }: ShortsListProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {shorts.map((short) => (
        <Card key={short.id} className="relative overflow-hidden cursor-pointer">
          <div className="aspect-[9/16] bg-black flex items-center justify-center">
            {short.thumbnailUrl ? (
              <img 
                src={short.thumbnailUrl} 
                alt={short.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white">Video</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-8 h-8 text-white opacity-80" />
            </div>
          </div>
          <div className="p-2">
            <p className="text-sm font-medium truncate">{short.title}</p>
            <p className="text-xs text-gray-500">{short.views} views</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
