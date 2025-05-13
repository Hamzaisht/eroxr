import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2 } from "lucide-react";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { UploadOptions } from "@/utils/media/types";

interface FileUploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: (url: string, file: File) => void;
}

export const FileUploadDialog = ({
  open,
  setOpen,
  onSuccess
}: FileUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileCategory, setFileCategory] = useState("media");
  const [maxFileSizeMB, setMaxFileSizeMB] = useState(100);
  const [acceptedFileTypes, setAcceptedFileTypes] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { uploadMedia, uploadState } = useMediaUpload();
  const session = useSession();
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !session?.user) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadOptions = {
        contentCategory: fileCategory,
        maxSizeInMB: maxFileSizeMB,
        allowedTypes: acceptedFileTypes
      };

      const result = await uploadMedia(selectedFile, uploadOptions);

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      if (result.url) {
        setUploadedUrl(result.url);
        onSuccess?.(result.url, selectedFile);

        toast({
          title: "Upload successful",
          description: "Your file has been uploaded."
        });
      } else {
        throw new Error("Upload succeeded but no URL returned");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      
      setError(error.message || "An error occurred during upload");
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setUploadedUrl(null);
    setError(null);
  };

  // Check if upload is complete
  const isComplete = uploadState.isComplete;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Select a file to upload to our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              File
            </Label>
            <Input
              type="file"
              id="file"
              className="col-span-3"
              onChange={handleFileSelect}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              type="text"
              id="category"
              defaultValue={fileCategory}
              className="col-span-3"
              onChange={(e) => setFileCategory(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxSize" className="text-right">
              Max Size (MB)
            </Label>
            <Input
              type="number"
              id="maxSize"
              defaultValue={maxFileSizeMB}
              className="col-span-3"
              onChange={(e) => setMaxFileSizeMB(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="types" className="text-right">
              Accepted Types
            </Label>
            <Input
              type="text"
              id="types"
              placeholder="image/*, video/*"
              className="col-span-3"
              onChange={(e) =>
                setAcceptedFileTypes(e.target.value.split(",").map((t) => t.trim()))
              }
            />
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleFileUpload}
            className="ml-2"
            disabled={isUploading || isComplete || !selectedFile}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                Upload <UploadCloud className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
