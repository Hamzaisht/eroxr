
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileUploadButtonProps } from "./types";

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
  allowedTypes,
  buttonText,
  buttonVariant = 'default',
  isUploading
}) => {
  return (
    <div>
      <input
        type="file"
        id="media-upload-input"
        className="hidden"
        accept={allowedTypes.join(',')}
        onChange={onFileSelect}
        disabled={isUploading}
      />
      
      <Button
        type="button"
        variant={buttonVariant as any}
        className="w-full"
        onClick={() => document.getElementById('media-upload-input')?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </div>
  );
};
