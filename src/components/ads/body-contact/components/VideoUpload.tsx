
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoUploadProps {
  videoFile: File | null;
  onUpdateVideoFile: (file: File | null) => void;
}

export const VideoUpload = ({ videoFile, onUpdateVideoFile }: VideoUploadProps) => {
  return (
    <div className="space-y-2">
      <Label>Profile Video (Optional)</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => alert("Video upload coming soon")}
          >
            Upload Video
          </Button>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {videoFile ? videoFile.name : "Video upload feature coming soon"}
        </p>
      </div>
    </div>
  );
};
