
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PreviewGridProps {
  previews: string[];
  onRemove: (index: number) => void;
  isUploading: boolean;
  onManualUpload: () => void;
  autoUpload: boolean;
}

export const PreviewGrid = ({ 
  previews, 
  onRemove, 
  isUploading, 
  onManualUpload, 
  autoUpload 
}: PreviewGridProps) => {
  if (previews.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative">
            <img 
              src={preview} 
              alt={`Preview ${index}`} 
              className="rounded-md aspect-square object-cover" 
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full shadow-md hover:bg-muted text-muted-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      {!autoUpload && previews.length > 0 && (
        <div className="mt-4 flex justify-end">
          <Button 
            onClick={onManualUpload} 
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Files'}
          </Button>
        </div>
      )}
    </div>
  );
};
