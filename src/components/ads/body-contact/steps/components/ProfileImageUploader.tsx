
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";

interface ProfileImageUploaderProps {
  onImageChange: (file: File | null, preview: string) => void;
}

export const ProfileImageUploader = ({ onImageChange }: ProfileImageUploaderProps) => {
  const [preview, setPreview] = useState<string>("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onImageChange(file, previewUrl);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
        {preview ? (
          <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
        ) : (
          <Camera className="w-8 h-8 text-gray-400" />
        )}
      </div>
      
      <div className="space-y-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="profile-image-upload"
        />
        <label htmlFor="profile-image-upload">
          <Button type="button" variant="outline" className="cursor-pointer" asChild>
            <span>
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
};
