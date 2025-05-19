
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  buttonText?: string;
}

export function FileUpload({
  onChange,
  accept = "image/*",
  multiple = false,
  className = "",
  buttonText = "Upload File"
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a fake change event
      const event = {
        target: {
          files: e.dataTransfer.files
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(event);
    }
  };

  const triggerFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div 
      className={`${className} relative border-2 border-dashed rounded-md p-4 ${
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300/20'
      } transition-colors`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={onChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <Upload className="h-8 w-8 text-gray-400" />
        <div className="space-y-1">
          <p className="text-sm text-gray-400">Drag and drop or click to upload</p>
          <p className="text-xs text-gray-500">{accept.replace(/,/g, ', ')}</p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={triggerFileInput}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

export default FileUpload;
