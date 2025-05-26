
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewStoryUploaderProps {
  onUpload?: (file: File) => void;
}

export const NewStoryUploader = ({ onUpload }: NewStoryUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Coming soon",
      description: "Story upload functionality will be available soon"
    });
  };

  return (
    <Card className="p-6">
      <div className="text-center">
        <div className="flex justify-center space-x-4 mb-4">
          <Camera className="w-8 h-8 text-gray-400" />
          <Upload className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-medium mb-2">Create New Story</h3>
        <p className="text-sm text-gray-500 mb-4">
          Share a moment with your followers
        </p>
        
        <Button onClick={handleUpload} disabled={isUploading}>
          Upload Story
        </Button>
      </div>
    </Card>
  );
};
