
import { AudioRendererProps } from "./types";

export const AudioRenderer = ({ mediaItem, mediaUrl, controls, onLoad, onError }: AudioRendererProps) => {
  return (
    <div className="flex items-center justify-center bg-gray-900 p-4 w-full h-full">
      <audio
        src={mediaUrl}
        controls={controls}
        className="w-full max-w-md"
        onLoadedData={onLoad}
        onError={onError}
        preload="metadata"
      >
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};
