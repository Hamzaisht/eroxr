
import { Card } from "@/components/ui/card";
import { Image, Video, FileText } from "lucide-react";

interface UniversalMediaProps {
  src: string;
  type: 'image' | 'video' | 'audio' | 'document';
  alt?: string;
  className?: string;
}

export const UniversalMedia = ({ src, type, alt, className }: UniversalMediaProps) => {
  const renderMedia = () => {
    switch (type) {
      case 'image':
        return (
          <img 
            src={src} 
            alt={alt} 
            className={`w-full h-full object-cover ${className || ''}`}
          />
        );
      case 'video':
        return (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <Video className="w-12 h-12 text-white opacity-80" />
          </div>
        );
      case 'document':
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Image className="w-12 h-12 text-gray-400" />
          </div>
        );
    }
  };

  return (
    <Card className="overflow-hidden">
      {renderMedia()}
    </Card>
  );
};
