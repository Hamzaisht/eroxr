
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from '@supabase/auth-helpers-react';
import { safePostInsert } from '@/utils/supabase/type-guards';

// Define FileUpload component
const FileUpload = ({ onChange, accept }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, accept: string }) => {
  return (
    <input
      type="file"
      onChange={onChange}
      accept={accept}
      className="block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0
        file:text-sm file:font-semibold
        file:bg-primary file:text-white
        hover:file:bg-primary/90"
    />
  );
};

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: 'Not authenticated',
        description: 'Please log in to create a post',
        variant: 'destructive',
      });
      return;
    }

    if (!content && mediaUrls.length === 0) {
      toast({
        title: 'Empty post',
        description: 'Please add some content or media to your post',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Use the type-safe helper to create post data
      const postData = safePostInsert({
        creator_id: session.user.id,
        content,
        media_url: mediaUrls.length > 0 ? mediaUrls : null,
        visibility: 'public',
      });

      const { data, error } = await supabase.from('posts').insert(postData).select();

      if (error) {
        throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['posts'] });

      toast({
        title: 'Post created',
        description: 'Your post has been published',
      });

      setContent('');
      setMediaUrls([]);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      // Simulate file upload
      setTimeout(() => {
        const fakeUrls = Array.from(e.target.files || []).map(
          (_, i) => `https://example.com/fake-image-${i}.jpg`
        );
        setMediaUrls(prevUrls => [...prevUrls, ...fakeUrls]);
        setIsUploading(false);
      }, 1000);
    }
  };

  const removeMedia = (urlToRemove: string) => {
    setMediaUrls(prevUrls => prevUrls.filter(url => url !== urlToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px]"
          />
          {mediaUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {mediaUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Uploaded media ${index}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    onClick={() => removeMedia(url)}
                    className="absolute top-1 right-1 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center">
            <FileUpload onChange={handleFileChange} accept="image/*" />
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isUploading || (!content && mediaUrls.length === 0)}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
