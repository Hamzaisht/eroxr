
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaUploaderProps {
  onUpload?: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export const MediaUploader = ({ 
  onUpload, 
  maxFiles = 5,
  acceptedTypes = ['image/*', 'video/*']
}: MediaUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Coming soon",
      description: "Media upload functionality will be available soon"
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">
          Select up to {maxFiles} files to upload
        </p>
        <Button onClick={handleUpload} className="mt-2">
          Choose Files
        </Button>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm truncate">{file.name}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
