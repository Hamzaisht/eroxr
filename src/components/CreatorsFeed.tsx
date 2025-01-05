import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { ScrollArea } from "./ui/scroll-area";
import { PostCard } from "./feed/PostCard";
import { LoadingSkeleton } from "./feed/LoadingSkeleton";
import { Post } from "./feed/types";
import { useState } from "react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const POSTS_PER_PAGE = 5;

export const CreatorsFeed = () => {
  const { toast } = useToast();
  const session = useSession();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["posts", session?.user?.id, currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const { data: posts, error, count } = await supabase
        .from("posts")
        .select(`
          id,
          content,
          created_at,
          creator_id,
          creator:profiles(username, avatar_url),
          likes_count,
          comments_count,
          media_url,
          has_liked:post_likes!inner(id)
        `, { count: 'exact' })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        toast({
          title: "Error fetching posts",
          description: "Could not load posts. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      return {
        posts: posts?.map(post => ({
          ...post,
          has_liked: post.has_liked?.length > 0
        })) || [],
        totalCount: count || 0
      };
    },
  });

  const totalPages = Math.ceil((postsData?.totalCount || 0) / POSTS_PER_PAGE);

  const handleLike = async (postId: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts.",
        duration: 3000,
      });
      return;
    }

    try {
      const { error: existingLikeError, data: existingLike } = await supabase
        .from("post_likes")
        .select()
        .eq("post_id", postId)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (existingLikeError) throw existingLikeError;

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", session.user.id);

        if (deleteError) throw deleteError;
      } else {
        const { error: insertError } = await supabase
          .from("post_likes")
          .insert([{ post_id: postId, user_id: session.user.id }]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4 pr-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-4">
              {postsData?.posts.map((post) => (
                <PostCard key={post.id} post={post} onLike={handleLike} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
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
              <PaginationNext
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};