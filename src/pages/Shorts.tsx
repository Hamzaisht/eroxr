
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShortsFeed } from "@/components/home/ShortsFeed";
import { LoadingState } from "@/components/ui/LoadingState";
import { UploadShortButton } from "@/components/home/UploadShortButton";

const Shorts = () => {
  const { videoId } = useParams<{ videoId?: string }>();

  // Set page title
  useEffect(() => {
    document.title = "Shorts - Short Videos";
    console.log("Shorts page mounted, videoId:", videoId);
  }, [videoId]);

  return (
    <div className="min-h-screen bg-black">
      <ShortsFeed specificShortId={videoId || null} />
      {/* Add upload button at the bottom right */}
      <div className="fixed bottom-4 right-4">
        <UploadShortButton />
      </div>
    </div>
  );
};

export default Shorts;
