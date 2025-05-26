
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaUploadSectionProps {
  onFilesSelected?: (files: File[]) => void;
}

export const MediaUploadSection = ({ onFilesSelected }: MediaUploadSectionProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Coming soon",
      description: "Media upload functionality will be available soon"
    });
  };

  return (
    <Card className="p-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <div className="flex justify-center space-x-4 mb-4">
          <Image className="w-8 h-8 text-gray-400" />
          <Video className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-medium mb-2">Upload Media</h3>
        <p className="text-sm text-gray-500 mb-4">
          Drag and drop files here or click to browse
        </p>
        
        <Button onClick={handleUpload}>
          <Upload className="w-4 h-4 mr-2" />
          Choose Files
        </Button>
      </div>
    </Card>
  );
};
