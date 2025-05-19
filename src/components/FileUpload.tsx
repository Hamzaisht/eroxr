
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export function FileUpload({
  onChange,
  accept = "image/*",
  multiple = false,
  disabled = false
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={disabled}
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Media
      </Button>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={onChange}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
      />
    </div>
  );
}
