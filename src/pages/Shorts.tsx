
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShortsFeed } from "@/components/home/ShortsFeed";
import { LoadingState } from "@/components/ui/LoadingState";
import { UploadShortButton } from "@/components/home/UploadShortButton";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

const Shorts = () => {
  const { videoId } = useParams<{ videoId?: string }>();
  const navigate = useNavigate();
  const session = useSession();
  const { toast } = useToast();

  // Set page title
  useEffect(() => {
    document.title = "Shorts - Short Videos";
    console.log("Shorts page mounted, videoId:", videoId);
  }, [videoId]);

  const handleUploadClick = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload shorts",
        variant: "destructive"
      });
      return;
    }
    
    navigate("/shorts/upload");
  };

  return (
    <div className="min-h-screen bg-black">
      <ShortsFeed specificShortId={videoId || null} />
      {/* Add upload button at the bottom right */}
      <div className="fixed bottom-4 right-4">
        <UploadShortButton onUploadClick={handleUploadClick} />
      </div>
    </div>
  );
};

export default Shorts;
