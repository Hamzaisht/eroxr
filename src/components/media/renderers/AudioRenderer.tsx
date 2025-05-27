
import { MediaRendererProps } from "@/utils/media/types";

export const AudioRenderer = ({ media, className, controls = true }: MediaRendererProps) => {
  return (
    <div className={`flex items-center justify-center bg-gray-900 p-4 ${className}`}>
      <audio
        src={media.url}
        controls={controls}
        className="w-full max-w-md"
        preload="metadata"
      >
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};
