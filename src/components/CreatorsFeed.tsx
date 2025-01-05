import { useSession } from "@supabase/auth-helpers-react";
import { ScrollArea } from "./ui/scroll-area";
import { PostCard } from "./feed/PostCard";
import { LoadingSkeleton } from "./feed/LoadingSkeleton";
import { useState } from "react";
import { Button } from "./ui/button";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "./ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePosts, POSTS_PER_PAGE } from "./feed/usePosts";
import { usePostActions } from "./feed/usePostActions";

export const CreatorsFeed = () => {
  const session = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: postsData, isLoading } = usePosts(session?.user?.id, currentPage);
  const { handleLike, handleDelete } = usePostActions(session);

  const totalPages = Math.ceil((postsData?.totalCount || 0) / POSTS_PER_PAGE);

  return (
    <div className="space-y-6">
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4 pr-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-4">
              {postsData?.posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={handleLike}
                  onDelete={handleDelete}
                  currentUserId={session?.user?.id}
                />
              ))}
              {postsData?.posts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No posts found. Start following creators or create your own post!
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};