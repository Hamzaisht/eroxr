import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface MediaUploadSectionProps {
  selectedFiles: FileList | null;
  onFileSelect: (files: FileList | null) => void;
  isPayingCustomer: boolean | null;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MediaUploadSection = ({
  selectedFiles,
  onFileSelect,
  isPayingCustomer,
  handleFileSelect
}: MediaUploadSectionProps) => {
  const { toast } = useToast();

  const validateVideoFile = async (file: File): Promise<boolean> => {
    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';

      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          const duration = video.duration;
          if (duration > 1200) { // 20 minutes = 1200 seconds
            toast({
              title: "Video too long",
              description: "Videos must be 20 minutes or shorter",
              variant: "destructive",
            });
            resolve(false);
          }
          resolve(true);
        };
        video.src = URL.createObjectURL(file);
      });
    }
    return true;
  };

  const handleFileValidation = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isValid = await validateVideoFile(file);
      if (!isValid) {
        e.target.value = '';
        return;
      }
    }

    handleFileSelect(e);
  };

  return (
    <div className="space-y-2">
      <Label>Media</Label>
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('post-file-upload')?.click()}
          className="w-full"
        >
          <ImagePlus className="h-4 w-4 mr-2" />
          {selectedFiles?.length ? `${selectedFiles.length} file(s) selected` : 'Add Media'}
        </Button>
        <input
          type="file"
          id="post-file-upload"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileValidation}
          disabled={!isPayingCustomer}
        />
      </div>
      {!isPayingCustomer && (
        <p className="text-sm text-muted-foreground">
          Upgrade to upload media files
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        Supported formats: Images (JPG, PNG, GIF) and Videos (MP4, WebM) up to 20 minutes
      </p>
    </div>
  );
};