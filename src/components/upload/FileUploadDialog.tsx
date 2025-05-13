import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, X } from "lucide-react";

interface FileUploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setMediaUrl: (url: string) => void;
}

export function FileUploadDialog({
  open,
  setOpen,
  setMediaUrl,
}: FileUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<string>("generic");
  const [contentCategory, setContentCategory] = useState<string>("generic");
  const { uploadMedia, uploadState, resetUploadState } = useMediaUpload();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    // Replace the type error parts with updated code using proper types
    const contentType: "profile" | "post" | "story" | "message" | "shorts" | "generic" = 
      (uploadType as "profile" | "post" | "story" | "message" | "shorts" | "generic") || "generic";

    const uploadContentType: "profile" | "post" | "story" | "message" | "shorts" | "generic" = 
      (contentCategory as "profile" | "post" | "story" | "message" | "shorts" | "generic") || "generic";

    const result = await uploadMedia(file, {
      contentCategory: uploadContentType,
      maxSizeInMB: 100,
      allowedTypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/quicktime",
      ],
    });

    if (result.success && result.url) {
      setMediaUrl(result.url);
      toast({
        title: "Upload successful",
        description: "Your file has been successfully uploaded.",
      });
      setOpen(false);
      resetUploadState();
    } else {
      toast({
        title: "Upload failed",
        description: result.error || "There was an error during upload.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Upload your media to our secure servers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="picture" className="text-right">
              Upload picture
            </Label>
            <Input
              type="file"
              id="picture"
              onChange={handleFileChange}
              disabled={uploadState.isUploading}
              className="col-span-3"
            />
          </div>
          {uploadState.isUploading && (
            <Progress value={uploadState.progress} className="w-full" />
          )}
          {uploadState.isComplete && uploadState.success && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm text-green-500">Upload complete!</p>
            </div>
          )}
          {uploadState.error && (
            <div className="flex items-center space-x-2">
              <X className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-500">{uploadState.error}</p>
            </div>
          )}
        </div>
        <Button type="submit" onClick={handleUpload} disabled={uploadState.isUploading}>
          Upload Media
        </Button>
      </DialogContent>
    </Dialog>
  );
}
