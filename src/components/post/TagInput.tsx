import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const TagInput = ({ tags, onTagsChange }: TagInputProps) => {
  const [currentTag, setCurrentTag] = useState("");

  const handleTagSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        onTagsChange([...tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Add tags (press Enter)"
        value={currentTag}
        onChange={(e) => setCurrentTag(e.target.value)}
        onKeyDown={handleTagSubmit}
        className="bg-luxury-dark/30 border-luxury-neutral/10"
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};