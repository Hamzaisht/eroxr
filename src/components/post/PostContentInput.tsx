import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "./TagInput";

interface PostContentInputProps {
  content: string;
  setContent: (content: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
}

export const PostContentInput = ({ 
  content, 
  setContent, 
  tags, 
  setTags 
}: PostContentInputProps) => {
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Extract hashtags from content
    const hashtagRegex = /#[^\s#]+/g;
    const foundTags = newContent.match(hashtagRegex)?.map(tag => tag.slice(1)) || [];
    
    // Update tags if new ones are found
    if (foundTags.length > 0) {
      setTags([...new Set([...tags, ...foundTags])]);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="What's on your mind? Use #hashtags to categorize your post..."
        value={content}
        onChange={handleContentChange}
        className="min-h-[120px] bg-luxury-dark/30 border-luxury-neutral/10 text-luxury-neutral placeholder:text-luxury-neutral/40 resize-none"
        autoFocus
      />
      <TagInput tags={tags} onTagsChange={setTags} />
    </div>
  );
};