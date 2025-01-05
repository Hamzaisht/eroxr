import { Image, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MediaUploadButtonProps {
  isPayingCustomer: boolean | null;
  onFileSelect: (files: FileList | null) => void;
  selectedFiles: FileList | null;
}

export const MediaUploadButton = ({
  isPayingCustomer,
  onFileSelect,
  selectedFiles,
}: MediaUploadButtonProps) => {
  const { toast } = useToast();

  const handleClick = () => {
    if (!isPayingCustomer) {
      toast({
        title: "Premium feature",
        description: "Only paying customers can upload media",
        variant: "destructive",
      });
      return;
    }
    document.getElementById('file-upload')?.click();
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="relative overflow-hidden"
        onClick={handleClick}
      >
        {isPayingCustomer ? (
          <Image className="h-4 w-4" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(e) => onFileSelect(e.target.files)}
          disabled={!isPayingCustomer}
        />
      </Button>
      {selectedFiles && (
        <span className="text-sm text-muted-foreground">
          {selectedFiles.length} file(s) selected
        </span>
      )}
      {!isPayingCustomer && (
        <span className="text-sm text-muted-foreground">
          Upgrade to upload media
        </span>
      )}
    </div>
  );
};