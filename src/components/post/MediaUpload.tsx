
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaUploadProps {
  onUploadComplete?: (files: string[]) => void;
}

export const MediaUpload = ({ onUploadComplete }: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Coming soon",
      description: "Media upload functionality will be available soon"
    });
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <div className="mt-4">
        <h3 className="text-lg font-medium">Upload Media</h3>
        <p className="text-sm text-gray-500 mt-2">
          Media upload functionality coming soon
        </p>
      </div>
      <Button onClick={handleUpload} disabled={isUploading} className="mt-4">
        Select Files
      </Button>
    </div>
  );
};
