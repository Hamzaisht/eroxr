
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShortsFeed } from "@/components/home/ShortsFeed";
import { LoadingState } from "@/components/ui/LoadingState";

const Shorts = () => {
  const { videoId } = useParams<{ videoId?: string }>();

  // Set page title
  useEffect(() => {
    document.title = "Shorts - Short Videos";
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <ShortsFeed specificShortId={videoId || null} />
    </div>
  );
};

export default Shorts;
