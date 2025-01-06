import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface VisibilitySelectProps {
  visibility: "public" | "subscribers_only";
  onVisibilityChange: (value: "public" | "subscribers_only") => void;
}

export const VisibilitySelect = ({ visibility, onVisibilityChange }: VisibilitySelectProps) => {
  return (
    <div className="space-y-2">
      <Label>Post Visibility</Label>
      <RadioGroup
        value={visibility}
        onValueChange={(value: "public" | "subscribers_only") => onVisibilityChange(value)}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="public" id="public" />
          <Label htmlFor="public">Public</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="subscribers_only" id="subscribers_only" />
          <Label htmlFor="subscribers_only">Subscribers Only</Label>
        </div>
      </RadioGroup>
    </div>
  );
};