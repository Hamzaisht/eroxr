import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
          onChange={handleFileSelect}
          disabled={!isPayingCustomer}
        />
      </div>
      {!isPayingCustomer && (
        <p className="text-sm text-muted-foreground">
          Upgrade to upload media files
        </p>
      )}
    </div>
  );
};