
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MediaUploader } from "./MediaUploader";
import { MultiFileUploader } from "./MultiFileUploader";
import { Upload, Image, FileVideo } from "lucide-react";
import { UploadOptions } from "@/utils/media/types";

export interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded?: (url: string) => void;
  onMultipleFilesUploaded?: (urls: string[]) => void;
  contentCategory?: UploadOptions['contentCategory'];
  title?: string;
  allowMultiple?: boolean;
  defaultTab?: 'single' | 'multiple';
  maxFiles?: number;
}

export const FileUploadDialog = ({
  open,
  onOpenChange,
  onFileUploaded,
  onMultipleFilesUploaded,
  contentCategory = 'generic',
  title = 'Upload Media',
  allowMultiple = true,
  defaultTab = 'single',
  maxFiles = 10
}: FileUploadDialogProps) => {
  const [activeTab, setActiveTab] = useState<'single' | 'multiple'>(defaultTab);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setUploadSuccess(false);
    }
  }, [open]);
  
  // Handle single file upload completion
  const handleSingleUploadComplete = (url: string) => {
    setUploadSuccess(true);
    if (onFileUploaded) {
      onFileUploaded(url);
    }
    
    // Close dialog after delay
    setTimeout(() => {
      onOpenChange(false);
    }, 1500);
  };
  
  // Handle multiple files upload completion
  const handleMultipleUploadsComplete = (urls: string[]) => {
    if (urls.length > 0) {
      setUploadSuccess(true);
      if (onMultipleFilesUploaded) {
        onMultipleFilesUploaded(urls);
      }
      
      // Close dialog after delay
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        {allowMultiple ? (
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'single' | 'multiple')}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="single" className="flex items-center gap-1.5">
                <Image className="h-4 w-4" />
                <span>Single File</span>
              </TabsTrigger>
              <TabsTrigger value="multiple" className="flex items-center gap-1.5">
                <FileVideo className="h-4 w-4" />
                <span>Multiple Files</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="single" className="mt-4">
              <MediaUploader
                context={contentCategory}
                onComplete={handleSingleUploadComplete}
                showPreview={true}
                autoUpload={true}
              />
            </TabsContent>
            
            <TabsContent value="multiple" className="mt-4">
              <MultiFileUploader 
                contentCategory={contentCategory}
                onUploadsComplete={handleMultipleUploadsComplete}
                maxFiles={maxFiles}
                autoUpload={true}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="mt-4">
            <MediaUploader
              context={contentCategory}
              onComplete={handleSingleUploadComplete}
              showPreview={true}
              autoUpload={true}
            />
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;
