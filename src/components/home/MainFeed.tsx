import { useMediaQuery } from "@/hooks/use-mobile";
import { FeedContainer } from "./feed/components/FeedContainer";
import type { MainFeedProps } from "./types";

export const MainFeed = ({
  userId,
  isPayingCustomer,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive,
}: MainFeedProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className={`w-full ${isMobile ? "px-2" : "px-4"} py-6`}>
      <FeedContainer
        userId={userId}
        isPayingCustomer={isPayingCustomer}
        onOpenCreatePost={onOpenCreatePost}
        onFileSelect={onFileSelect}
        onOpenGoLive={onOpenGoLive}
      />
    </div>
  );
};