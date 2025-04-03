import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export function useContentModeration() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  
  const getTableNameFromContentType = (contentType: string): string | null => {
    switch (contentType) {
      case 'post':
      case 'posts':
        return 'posts';
      case 'video':
      case 'videos':
        return 'videos';
      case 'dating_ad':
      case 'dating_ads':
        return 'dating_ads';
      default:
        return null;
    }
  };
  
  const logModerationAction = async (contentId: string, contentType: string, action: string, reason: string) => {
    try {
      const { error } = await supabase.from('moderation_logs').insert({
        content_id: contentId,
        content_type: contentType,
        action: action,
        reason: reason
      });
      
      if (error) {
        console.error('Error logging moderation action:', error);
      }
    } catch (error) {
      console.error('Error logging moderation action:', error);
    }
  };
  
  const deleteContent = async (contentId: string, contentType: string) => {
    setIsLoading(true);
    try {
      let tableName = getTableNameFromContentType(contentType);
      
      if (!tableName) {
        throw new Error(`Unknown content type: ${contentType}`);
      }
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', contentId);
        
      if (error) throw error;
      
      await logModerationAction(contentId, contentType, 'delete', `Content deleted by admin`);
      
      toast({
        title: "Content Deleted",
        description: "The content has been successfully deleted.",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete the content. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const editContent = async (contentId: string, contentType: string, editedContent: string) => {
    setIsLoading(true);
    try {
      let tableName = getTableNameFromContentType(contentType);
      
      if (!tableName) {
        throw new Error(`Unknown content type: ${contentType}`);
      }
      
      // First, check if we need to preserve the original content
      const { data: existingContent, error: fetchError } = await supabase
        .from(tableName)
        .select('content, original_content')
        .eq('id', contentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      let updateData: Record<string, any> = { content: editedContent };
      
      // If there's no original_content yet, store the current content as original
      if (existingContent && !existingContent.original_content && existingContent.content) {
        updateData.original_content = existingContent.content;
      }
      
      // Update the content
      const { error: updateError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', contentId);
      
      if (updateError) throw updateError;
      
      // Log the action
      await logModerationAction(contentId, contentType, 'edit', `Content edited by admin`);
      
      toast({
        title: "Content Updated",
        description: "The content has been successfully edited.",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error editing content:', error);
      toast({
        title: "Edit Failed",
        description: "Failed to edit the content. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };
  
  const restoreContent = async (contentId: string, contentType: string) => {
    setIsLoading(true);
    try {
      let tableName = getTableNameFromContentType(contentType);
      
      if (!tableName) {
        throw new Error(`Unknown content type: ${contentType}`);
      }
      
      const { error } = await supabase
        .from(tableName)
        .update({ visibility: 'public' })
        .eq('id', contentId);
        
      if (error) throw error;
      
      await logModerationAction(contentId, contentType, 'restore', `Content restored by admin`);
      
      toast({
        title: "Content Restored",
        description: "The content has been successfully restored.",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error restoring content:', error);
      toast({
        title: "Restore Failed",
        description: "Failed to restore the content. Please try again.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    deleteContent,
    editContent,
    restoreContent
  };
}
