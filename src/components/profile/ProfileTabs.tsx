
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaGrid } from "./MediaGrid";
import { MediaSource } from "@/types/media";

interface ProfileTabsProps {
  userId: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
}

export function ProfileTabs({
  userId,
  postCount,
  followerCount,
  followingCount,
}: ProfileTabsProps) {
  // Sample media items for demonstration
  const sampleMediaItems: MediaSource[] = [
    {
      url: "https://placehold.co/300x300",
      type: "image" as any,
    },
    {
      url: "https://placehold.co/300x300",
      type: "image" as any,
    },
  ];

  const handleMediaSelect = (item: MediaSource) => {
    console.log("Selected media item:", item);
  };

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="posts" className="flex flex-col">
          <span className="font-semibold">{postCount}</span>
          <span className="text-xs">Posts</span>
        </TabsTrigger>
        <TabsTrigger value="followers" className="flex flex-col">
          <span className="font-semibold">{followerCount}</span>
          <span className="text-xs">Followers</span>
        </TabsTrigger>
        <TabsTrigger value="following" className="flex flex-col">
          <span className="font-semibold">{followingCount}</span>
          <span className="text-xs">Following</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="mt-0">
        <MediaGrid items={sampleMediaItems} onItemClick={handleMediaSelect} />
      </TabsContent>
      <TabsContent value="followers" className="mt-0">
        <div className="text-center p-4">
          <p className="text-muted-foreground">Followers will appear here</p>
        </div>
      </TabsContent>
      <TabsContent value="following" className="mt-0">
        <div className="text-center p-4">
          <p className="text-muted-foreground">Following will appear here</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
