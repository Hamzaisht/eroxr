
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Update props to accept selectedFiles
export interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles?: FileList | null;
  onFileSelect: (files: FileList | null) => void;
}

export function CreatePostDialog({
  open,
  onOpenChange,
  selectedFiles,
  onFileSelect
}: CreatePostDialogProps) {
  const [caption, setCaption] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process post creation
    console.log("Creating post with caption:", caption);
    // Reset form fields
    setCaption("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="caption" className="text-sm font-medium">
              Caption
            </label>
            <textarea
              id="caption"
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Media</label>
            <input
              type="file"
              accept="image/*,video/*"
              className="w-full"
              onChange={(e) => onFileSelect(e.target.files)}
              multiple
            />
            
            {/* Display selected file info */}
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Selected files:</p>
                <ul className="text-sm">
                  {Array.from(selectedFiles).map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Post</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
