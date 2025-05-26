
import { UniversalMedia } from "./UniversalMedia";

export const UniversalMediaDemo = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Universal Media Demo</h2>
      <div className="grid grid-cols-2 gap-4">
        <UniversalMedia 
          src="https://example.com/image.jpg" 
          alt="Demo image"
          className="w-full h-32 object-cover rounded"
        />
        <UniversalMedia 
          src="https://example.com/video.mp4" 
          className="w-full h-32 object-cover rounded"
        />
      </div>
    </div>
  );
};
