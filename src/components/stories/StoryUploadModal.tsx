
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Image, Video, Crown, Sparkles } from "lucide-react";
import { useStoryUpload } from "@/hooks/useStoryUpload";
import { Progress } from "@/components/ui/progress";

interface StoryUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StoryUploadModal = ({ open, onOpenChange }: StoryUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { uploadStory, uploading, uploadProgress } = useStoryUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      alert('Please select an image or video file');
      return;
    }

    // Check file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert('File size must be less than 100MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await uploadStory(selectedFile);
    
    if (result.success) {
      // Close modal and refresh stories
      handleClose();
      window.dispatchEvent(new CustomEvent('story-uploaded'));
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onOpenChange(false);
  };

  const isVideo = selectedFile?.type.startsWith('video/');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 border border-amber-500/20 text-white">
        <DialogHeader className="relative">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30l-15-15zm0 0l-15 15v-30l15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}
            />
          </div>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-amber-200 to-white bg-clip-text text-transparent relative">
            <Crown className="w-6 h-6 text-amber-300" />
            Share Your Divine Vision
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 relative">
          {!selectedFile ? (
            <div className="relative">
              <div className="border-2 border-dashed border-amber-400/30 rounded-lg p-8 text-center bg-gradient-to-br from-black/20 to-transparent backdrop-blur-sm">
                <div className="flex justify-center space-x-4 mb-4">
                  <div className="p-3 rounded-full bg-amber-500/20 border border-amber-400/30">
                    <Image className="w-8 h-8 text-amber-300" />
                  </div>
                  <div className="p-3 rounded-full bg-blue-500/20 border border-blue-400/30">
                    <Video className="w-8 h-8 text-blue-300" />
                  </div>
                </div>
                <p className="text-amber-100 mb-4 font-medium">
                  Ascend to immortality with your creation
                </p>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="story-upload"
                />
                <label
                  htmlFor="story-upload"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-lg hover:from-amber-400 hover:to-amber-500 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-amber-500/25"
                >
                  <Upload className="w-4 h-4" />
                  Choose Your Creation
                </label>
                <p className="text-xs text-blue-200 mt-4 opacity-75">
                  Max 100MB • Photos & Videos • Eternal for 24 hours
                </p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-amber-300 rounded-full opacity-60 animate-pulse" />
              <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-blue-300 rounded-full opacity-40 animate-pulse delay-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative bg-black/50 rounded-lg overflow-hidden aspect-[9/16] max-h-96 border border-amber-500/20">
                {isVideo ? (
                  <video
                    src={previewUrl || undefined}
                    className="w-full h-full object-contain"
                    controls
                    muted
                  />
                ) : (
                  <img
                    src={previewUrl || undefined}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedFile(null);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }
                  }}
                  className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 border border-amber-400/30"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2 bg-black/30 p-4 rounded-lg border border-amber-500/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-200">Ascending to Olympus...</span>
                    <span className="text-white font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 disabled:opacity-50"
                >
                  {uploading ? 'Ascending...' : 'Share Divine Story'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={uploading}
                  className="border-amber-400/30 text-amber-200 hover:bg-amber-500/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent pointer-events-none" />
      </DialogContent>
    </Dialog>
  );
};
