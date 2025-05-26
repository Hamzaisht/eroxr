
import { Card } from "@/components/ui/card";
import { Play } from "lucide-react";

interface VideoMessageProps {
  videoUrl: string;
  thumbnail?: string;
  title?: string;
}

export const VideoMessage = ({ videoUrl, thumbnail, title }: VideoMessageProps) => {
  return (
    <Card className="relative max-w-sm overflow-hidden cursor-pointer">
      <div className="aspect-video bg-black flex items-center justify-center">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-white">Video Preview</div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="w-12 h-12 text-white opacity-80" />
        </div>
      </div>
      {title && (
        <div className="p-2">
          <p className="text-sm font-medium truncate">{title}</p>
        </div>
      )}
    </Card>
  );
};
