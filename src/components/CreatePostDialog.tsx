
import { Button } from "@/components/ui/button";
import { Upload, X, Sparkles, Image, Video, Mic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PostForm } from "./CreatePostDialog/PostForm";
import { MediaUploadDisplay } from "./CreatePostDialog/MediaUploadDisplay";
import { useCreatePost } from "./CreatePostDialog/hooks/useCreatePost";
import { motion, AnimatePresence } from "framer-motion";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles: FileList | null;
  onFileSelect: (files: FileList | null) => void;
}

export const CreatePostDialog = ({ open, onOpenChange, selectedFiles, onFileSelect }: CreatePostDialogProps) => {
  const {
    content,
    setContent,
    visibility,
    setVisibility,
    isLoading,
    setIsLoading,
    uploadedAssetIds,
    uploadInProgress,
    uploadError,
    uploadSuccess,
    characterLimit,
    canSubmit,
    handleMediaUploadComplete,
    handleMediaUploadStart,
    resetForm,
    session,
    toast
  } = useCreatePost();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onFileSelect(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a post",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim() && uploadedAssetIds.length === 0) {
      toast({
        title: "Error",
        description: "Post must have content or media",
        variant: "destructive",
      });
      return;
    }

    if (content.length > characterLimit) {
      toast({
        title: "Error",
        description: `Post content cannot exceed ${characterLimit} characters`,
        variant: "destructive",
      });
      return;
    }

    if (uploadInProgress) {
      toast({
        title: "Error",
        description: "Please wait for media upload to complete",
        variant: "destructive",
      });
      return;
    }

    if (uploadError) {
      toast({
        title: "Error",
        description: `Media upload failed: ${uploadError}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("🚀 CreatePostDialog - Creating post with uploaded assets:", uploadedAssetIds);

      const postData = {
        content: content.trim(),
        creator_id: session.user.id,
        visibility: visibility,
        likes_count: 0,
        comments_count: 0,
        view_count: 0,
        share_count: 0,
        engagement_score: 0.0,
        is_ppv: false,
        is_featured: false,
        metadata: {
          has_media: uploadedAssetIds.length > 0,
          media_count: uploadedAssetIds.length,
          upload_session: Date.now(),
          created_via: 'dialog'
        }
      };

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

      if (postError) {
        console.error('CreatePostDialog - Post creation error:', postError);
        throw new Error(`Failed to create post: ${postError.message}`);
      }

      console.log("✅ CreatePostDialog - Post created successfully:", post.id);

      // Link media assets to the post
      if (uploadedAssetIds.length > 0 && post.id) {
        console.log("🔗 CreatePostDialog - Linking", uploadedAssetIds.length, "media assets to post", post.id);
        
        let successCount = 0;
        const linkingErrors: string[] = [];
        
        for (const assetId of uploadedAssetIds) {
          try {
            console.log(`🔗 CreatePostDialog - Linking asset ${assetId} to post ${post.id}`);
            
            const { data: currentAsset, error: fetchError } = await supabase
              .from('media_assets')
              .select('id, metadata, user_id, created_at')
              .eq('id', assetId)
              .eq('user_id', session.user.id)
              .single();

            if (fetchError || !currentAsset) {
              linkingErrors.push(`Asset ${assetId}: not found or access denied`);
              console.error(`❌ CreatePostDialog - Asset ${assetId} not found:`, fetchError);
              continue;
            }

            const updatedMetadata = {
              ...(currentAsset.metadata || {}),
              post_id: post.id,
              usage: 'post',
              linked_at: new Date().toISOString(),
              linked_by_user: session.user.id,
              post_created_at: post.created_at,
              linking_method: 'dialog_upload'
            };

            const { error: updateError } = await supabase
              .from('media_assets')
              .update({ metadata: updatedMetadata })
              .eq('id', assetId)
              .eq('user_id', session.user.id);

            if (updateError) {
              linkingErrors.push(`Asset ${assetId}: ${updateError.message}`);
              console.error(`❌ CreatePostDialog - Failed to link asset ${assetId}:`, updateError);
            } else {
              successCount++;
              console.log(`✅ CreatePostDialog - Successfully linked asset ${assetId} to post ${post.id}`);
            }
          } catch (error) {
            linkingErrors.push(`Asset ${assetId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            console.error(`💥 CreatePostDialog - Error linking asset ${assetId}:`, error);
          }
        }
        
        console.log(`📊 CreatePostDialog - Media linking complete: ${successCount}/${uploadedAssetIds.length} successful`);
        
        if (successCount === 0 && uploadedAssetIds.length > 0) {
          toast({
            title: "Warning",
            description: "Post created but media linking failed. Media may not appear.",
            variant: "destructive"
          });
        } else if (successCount < uploadedAssetIds.length) {
          toast({
            title: "Partial Success",
            description: `Post created with ${successCount}/${uploadedAssetIds.length} media files linked`,
          });
        } else {
          console.log("🎉 CreatePostDialog - All media assets linked successfully!");
        }
      }

      toast({
        title: "Success",
        description: "Post created successfully!",
      });

      resetForm();
      onFileSelect(null);
      onOpenChange(false);

    } catch (error: any) {
      console.error('CreatePostDialog - Error creating post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          {/* ANIMATED BACKDROP */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-gradient-to-br from-black/80 via-purple-900/20 to-black/80 backdrop-blur-sm z-[9998]" 
            onClick={() => onOpenChange(false)}
          />
          
          {/* PREMIUM MODAL - Design Studio Aesthetic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2 z-[9999] w-full max-w-[600px] max-h-[85vh] overflow-hidden"
          >
            {/* Glowing Border Container */}
            <div className="relative p-[1px] bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 rounded-3xl">
              {/* Inner Container with Glass Effect */}
              <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10">
                
                {/* Animated Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl animate-pulse" />
                
                {/* Content Container */}
                <div className="relative flex flex-col h-full p-8">
                  
                  {/* Premium Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl"
                      >
                        <Sparkles className="h-5 w-5 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                          Create New Post
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Share your creative vision with the world</p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onOpenChange(false)}
                      className="h-10 w-10 p-0 hover:bg-white/10 rounded-full transition-all duration-200"
                    >
                      <X className="h-5 w-5 text-gray-300" />
                    </Button>
                  </div>
                  
                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      {/* Enhanced Post Form */}
                      <div className="space-y-6">
                        <PostForm
                          content={content}
                          setContent={setContent}
                          visibility={visibility}
                          setVisibility={setVisibility}
                          characterLimit={characterLimit}
                        />
                      </div>

                      {/* Premium Media Upload Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg">
                              <Upload className="h-4 w-4 text-cyan-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-white">Add Media</h4>
                          </div>
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('media-upload')?.click()}
                            disabled={isLoading || uploadInProgress}
                            className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 hover:border-cyan-400/50 text-cyan-300 hover:text-cyan-200 transition-all duration-200"
                          >
                            <div className="flex items-center gap-2">
                              <Image className="h-4 w-4" />
                              <Video className="h-4 w-4" />
                              <Mic className="h-4 w-4" />
                            </div>
                            <span className="ml-2">Choose Files</span>
                          </Button>
                        </div>
                        
                        <input
                          id="media-upload"
                          type="file"
                          multiple
                          accept="image/*,video/*,audio/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />

                        {selectedFiles && selectedFiles.length > 0 && (
                          <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                            <MediaUploadDisplay
                              selectedFiles={selectedFiles}
                              uploadError={uploadError}
                              uploadSuccess={uploadSuccess}
                              uploadInProgress={uploadInProgress}
                              uploadedAssetIds={uploadedAssetIds}
                              onUploadComplete={handleMediaUploadComplete}
                              onUploadStart={handleMediaUploadStart}
                            />
                          </div>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Premium Action Bar */}
                  <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={isLoading || uploadInProgress}
                      className="bg-transparent border-gray-600 text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className="min-w-[120px] bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Creating...
                        </div>
                      ) : uploadInProgress ? (
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Upload className="h-4 w-4" />
                          </motion.div>
                          Uploading...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Create Post
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
