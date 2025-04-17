
import { useState, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ErosComment } from "@/types/eros";

export function useErosComments(videoId: string) {
  const [comments, setComments] = useState<ErosComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const session = useSession();
  const { toast } = useToast();
  
  // Fetch comments for a video
  const fetchComments = useCallback(async () => {
    if (!videoId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('post_id', videoId)
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      const mappedComments = (data || []).map(comment => {
        // Properly access the nested profile data
        const profile = comment.profiles as { username: string, avatar_url: string } | null;
        
        return {
          id: comment.id,
          content: comment.content,
          createdAt: comment.created_at,
          user: {
            id: comment.user_id,
            username: profile?.username || 'Anonymous',
            avatarUrl: profile?.avatar_url,
          },
          likes: 0, // This would come from a real likes table
          hasLiked: false,
        };
      });
      
      setComments(mappedComments);
    } catch (err: any) {
      console.error('Error fetching comments:', err);
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [videoId]);
  
  // Add a comment
  const addComment = useCallback(async (content: string) => {
    if (!session || !videoId) {
      throw new Error('Must be logged in to comment');
    }
    
    if (!content.trim()) {
      throw new Error('Comment cannot be empty');
    }
    
    try {
      // Add the comment
      const { data: newComment, error: commentError } = await supabase
        .from('comments')
        .insert({
          post_id: videoId,
          user_id: session.user.id,
          content: content.trim(),
        })
        .select('id, content, created_at')
        .single();
      
      if (commentError) {
        throw new Error(commentError.message);
      }
      
      // Increment comment count
      await supabase.rpc('increment_counter', {
        row_id: videoId,
        counter_name: 'comments_count',
        table_name: 'posts'
      });
      
      // Get user data
      const { data: userData } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', session.user.id)
        .single();
      
      // Create a new comment object
      const commentObj: ErosComment = {
        id: newComment.id,
        content: newComment.content,
        createdAt: newComment.created_at,
        user: {
          id: session.user.id,
          username: userData?.username || 'Anonymous',
          avatarUrl: userData?.avatar_url,
        },
        likes: 0,
        hasLiked: false,
      };
      
      // Update local state with the new comment
      setComments(prev => [commentObj, ...prev]);
      
      toast({
        description: "Comment added",
      });
      
    } catch (err: any) {
      console.error('Error adding comment:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to add comment',
        variant: "destructive"
      });
      throw err;
    }
  }, [videoId, session, toast]);
  
  // Like a comment
  const likeComment = useCallback(async (commentId: string) => {
    // In a real app, this would interact with a comment_likes table
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId
          ? {
              ...comment,
              hasLiked: !comment.hasLiked,
              likes: comment.hasLiked
                ? Math.max(0, comment.likes - 1)
                : comment.likes + 1,
            }
          : comment
      )
    );
  }, []);
  
  // Load comments on mount or when videoId changes
  useEffect(() => {
    if (videoId) {
      fetchComments();
    }
  }, [videoId, fetchComments]);
  
  return {
    comments,
    loading,
    error,
    addComment,
    likeComment,
    refreshComments: fetchComments,
  };
}
