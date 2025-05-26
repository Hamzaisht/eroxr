
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ErosUploadFormProps {
  onUploadComplete?: () => void;
}

export const ErosUploadForm = ({ onUploadComplete }: ErosUploadFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Coming soon",
      description: "Media upload functionality will be available soon"
    });
    
    if (onUploadComplete) {
      onUploadComplete();
    }
  };

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
      <h3 className="text-lg font-medium mb-2">Upload Content</h3>
      <p className="text-sm text-gray-500 mb-4">
        Media upload functionality coming soon
      </p>
      <Button onClick={handleUpload} disabled={isUploading}>
        Upload
      </Button>
    </div>
  );
};
