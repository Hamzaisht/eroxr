
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface VideoUploadProps {
  videoFile: File | null;
  onUpdateVideoFile: (file: File | null) => void;
}

export const VideoUpload = ({ videoFile, onUpdateVideoFile }: VideoUploadProps) => {
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        console.error("File too large");
        return;
      }
      onUpdateVideoFile(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Video Profile</Label>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="hidden"
          id="video-upload"
        />
        <Label
          htmlFor="video-upload"
          className="flex items-center gap-2 cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md"
        >
          <Upload className="h-4 w-4" />
          {videoFile ? 'Change Video' : 'Upload Video'}
        </Label>
        {videoFile && (
          <span className="text-sm text-muted-foreground">
            {videoFile.name}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Maximum size: 50MB. Recommended length: 30-60 seconds.
      </p>
    </div>
  );
};
