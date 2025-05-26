
interface VideoPreviewProps {
  videoUrl: string;
  className?: string;
}

export const VideoPreview = ({ videoUrl, className = "" }: VideoPreviewProps) => {
  return (
    <div className={`relative bg-black rounded-md overflow-hidden ${className}`}>
      <video
        src={videoUrl}
        className="w-full h-full object-cover"
        controls={false}
        muted
      />
    </div>
  );
};
