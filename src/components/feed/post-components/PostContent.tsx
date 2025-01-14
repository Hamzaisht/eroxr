import { ProtectedMedia } from "@/components/security/ProtectedMedia";

interface PostContentProps {
  content: string;
  mediaUrls?: string[];
  creatorId: string;
  onMediaClick: (url: string) => void;
}

export const PostContent = ({
  content,
  mediaUrls,
  creatorId,
  onMediaClick,
}: PostContentProps) => {
  const hasMedia = mediaUrls && mediaUrls.length > 0;

  return (
    <>
      <p className="text-luxury-neutral/90">{content}</p>
      
      {hasMedia && (
        <ProtectedMedia contentOwnerId={creatorId}>
          <div className="relative w-full overflow-hidden rounded-xl">
            <div className="overflow-x-auto scrollbar-hide w-full">
              <div className="flex w-full">
                {mediaUrls.map((url, index) => (
                  <div
                    key={index}
                    className="min-w-full h-full cursor-pointer group"
                    onClick={() => onMediaClick(url)}
                  >
                    <img
                      src={url}
                      alt={`Post media ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="eager"
                      decoding="sync"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ProtectedMedia>
      )}
    </>
  );
};