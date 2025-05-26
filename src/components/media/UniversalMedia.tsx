
interface UniversalMediaProps {
  src: string;
  alt?: string;
  className?: string;
}

export const UniversalMedia = ({ src, alt, className }: UniversalMediaProps) => {
  const isVideo = src.includes('.mp4') || src.includes('.webm') || src.includes('.mov');
  
  if (isVideo) {
    return (
      <video 
        src={src} 
        className={className}
        controls
      />
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
    />
  );
};
