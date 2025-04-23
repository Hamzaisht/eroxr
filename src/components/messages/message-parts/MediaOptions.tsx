
import { Button } from "@/components/ui/button";
import { Image, FileText, MapPin } from "lucide-react";

interface MediaOptionsProps {
  onImageSelect: () => void;
  onDocumentSelect: () => void;
  onClose: () => void;
}

export const MediaOptions = ({ onImageSelect, onDocumentSelect, onClose }: MediaOptionsProps) => {
  return (
    <div className="absolute bottom-full mb-2 left-0 bg-black/80 backdrop-blur-sm rounded-lg border border-white/10 p-1 z-10">
      <div className="grid grid-cols-1 gap-1 w-40">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex justify-start px-3 py-1.5 h-auto text-xs"
          onClick={() => {
            onImageSelect();
            onClose();
          }}
        >
          <Image className="h-4 w-4 mr-2" />
          Photo or Video
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex justify-start px-3 py-1.5 h-auto text-xs"
          onClick={() => {
            onDocumentSelect();
            onClose();
          }}
        >
          <FileText className="h-4 w-4 mr-2" />
          Document
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex justify-start px-3 py-1.5 h-auto text-xs"
          onClick={() => {
            alert("Location sharing will be implemented in a future update");
            onClose();
          }}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Location
        </Button>
      </div>
    </div>
  );
};
