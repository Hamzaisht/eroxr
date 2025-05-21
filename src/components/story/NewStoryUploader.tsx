import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, X } from 'lucide-react';
import { runFileDiagnostic } from '@/utils/upload/fileUtils';
import { uploadMediaToSupabase } from '@/utils/media/uploadUtils';
import { MediaAccessLevel } from '@/utils/media/types';

const bucket = 'stories';

export default function NewStoryUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    // CRITICAL: Run file diagnostic
    runFileDiagnostic(file);
    
    setFile(file);
  }, []);
  
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: 'image/*, video/*'
  });

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'destructive'
      });
      return;
    }
    
    if (!session?.user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to upload stories',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);

    try {
      // Use centralized upload utility
      const result = await uploadMediaToSupabase(
        file,
        bucket,
        {
          maxSizeMB: 50,
          accessLevel: MediaAccessLevel.PUBLIC
        }
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      toast({
        title: 'Upload complete',
        description: 'Your story has been uploaded successfully'
      });
      
      router.push('/');
    } catch (error: any) {
      console.error('Story upload error:', error);
      
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload story',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Upload New Story</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div {...getRootProps()} className={`relative border-2 border-dashed rounded-md p-6 mb-4 cursor-pointer ${isDragActive ? 'border-primary' : 'border-gray-300'}`}>
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{file.name} ({Math.round(file.size / 1024)} KB)</p>
              <Button type="button" variant="ghost" size="sm" onClick={handleRemoveFile}>
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                {isDragActive ? "Drop the file here" : "Drag 'n' drop a file here, or click to select a file"}
              </p>
              <p className="text-xs text-gray-500">
                (Images and videos are allowed)
              </p>
            </div>
          )}
        </div>
        <div className="mb-4">
          <Label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            rows={3}
            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
        <Button type="submit" disabled={uploading} className="w-full">
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading ...
            </>
          ) : (
            "Upload Story"
          )}
        </Button>
      </form>
    </div>
  );
}
