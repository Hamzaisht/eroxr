import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { PenSquare, Image, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CreatePostSectionProps {
  isPayingCustomer: boolean | null;
  onOpenCreatePost: () => void;
  onFileSelect: (files: FileList | null) => void;
}

export const CreatePostSection = ({ 
  isPayingCustomer, 
  onOpenCreatePost, 
  onFileSelect 
}: CreatePostSectionProps) => {
  const session = useSession();
  const { toast } = useToast();

  const handleFileSelect = (files: FileList | null) => {
    if (!isPayingCustomer && files) {
      toast({
        title: "Premium feature",
        description: "Only paying customers can upload media",
        variant: "destructive",
      });
      return;
    }
    onFileSelect(files);
  };

  return (
    <div className="rounded-lg border border-white/10 bg-luxury-dark/50 p-4 shadow-sm sticky top-20 z-50 mb-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${session?.user.id}`}>
          <div className="h-10 w-10 rounded-full bg-white/10" />
        </Link>
        <Button 
          variant="outline" 
          className="w-full justify-start text-white/60 border-white/10 hover:bg-white/5"
          onClick={onOpenCreatePost}
        >
          <PenSquare className="mr-2 h-4 w-4" />
          What's on your mind?
        </Button>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="relative overflow-hidden hover:bg-white/5 border-white/10"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            {isPayingCustomer ? (
              <Image className="h-5 w-5" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => handleFileSelect(e.target.files)}
              disabled={!isPayingCustomer}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};