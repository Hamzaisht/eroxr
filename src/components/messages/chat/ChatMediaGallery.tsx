
import { Card } from "@/components/ui/card";
import { Image, Video, FileText } from "lucide-react";

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
}

interface ChatMediaGalleryProps {
  mediaItems: MediaItem[];
}

export const ChatMediaGallery = ({ mediaItems }: ChatMediaGalleryProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {mediaItems.map((item) => (
        <Card key={item.id} className="p-4 text-center">
          <div className="flex flex-col items-center gap-2">
            {getIcon(item.type)}
            <span className="text-sm truncate w-full">{item.name}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
