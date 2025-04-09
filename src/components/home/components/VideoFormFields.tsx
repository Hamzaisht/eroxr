
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface VideoFormFieldsProps {
  title: string;
  description: string;
  isPremium: boolean;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onIsPremiumChange: (checked: boolean) => void;
}

export const VideoFormFields = ({
  title,
  description,
  isPremium,
  onTitleChange,
  onDescriptionChange,
  onIsPremiumChange
}: VideoFormFieldsProps) => {
  return (
    <div className="grid gap-4">
      <div className="grid w-full gap-1.5">
        <Label htmlFor="title" className="required">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={onTitleChange}
          className="bg-transparent"
          placeholder="Add a title to your video"
          maxLength={100}
          required
        />
        <div className="text-xs text-right text-luxury-neutral/60">
          {title.length}/100
        </div>
      </div>

      <div className="grid w-full gap-1.5">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={onDescriptionChange}
          className="bg-transparent"
          placeholder="Describe your video"
          rows={3}
          maxLength={500}
        />
        <div className="text-xs text-right text-luxury-neutral/60">
          {description.length}/500
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <Switch
          id="premium-toggle"
          checked={isPremium}
          onCheckedChange={onIsPremiumChange}
        />
        <Label htmlFor="premium-toggle">
          Make this Eros video Premium (59 SEK/month subscribers only)
        </Label>
      </div>
    </div>
  );
};
