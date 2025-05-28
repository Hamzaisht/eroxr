
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PostFormProps {
  content: string;
  setContent: (content: string) => void;
  visibility: "public" | "subscribers_only";
  setVisibility: (visibility: "public" | "subscribers_only") => void;
  characterLimit: number;
}

export const PostForm = ({
  content,
  setContent,
  visibility,
  setVisibility,
  characterLimit
}: PostFormProps) => {
  const charactersUsed = content.length;

  return (
    <>
      <div>
        <Label htmlFor="content">What's on your mind?</Label>
        <Textarea
          id="content"
          placeholder="Share your thoughts, experiences, or exclusive content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px] resize-none"
          maxLength={characterLimit}
        />
        <div className="flex justify-between items-center mt-2">
          <span className={`text-sm ${charactersUsed > characterLimit * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
            {charactersUsed}/{characterLimit}
          </span>
        </div>
      </div>

      <div>
        <Label htmlFor="visibility">Post Visibility</Label>
        <Select value={visibility} onValueChange={(value: "public" | "subscribers_only") => setVisibility(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public - Everyone can see</SelectItem>
            <SelectItem value="subscribers_only">Subscribers Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
