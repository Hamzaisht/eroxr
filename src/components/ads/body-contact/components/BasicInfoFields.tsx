
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BasicInfoFieldsProps {
  title: string;
  description: string;
  relationshipStatus: string;
  bodyType: string;
  onUpdateTitle: (value: string) => void;
  onUpdateDescription: (value: string) => void;
  onUpdateRelationshipStatus: (value: "single" | "couple" | "other") => void;
  onUpdateBodyType: (value: string) => void;
}

export const BasicInfoFields = ({
  title,
  description,
  relationshipStatus,
  bodyType,
  onUpdateTitle,
  onUpdateDescription,
  onUpdateRelationshipStatus,
  onUpdateBodyType
}: BasicInfoFieldsProps) => {
  const bodyTypes = [
    "athletic", "average", "slim", "curvy", "muscular", "plus_size"
  ];

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter a catchy title"
          value={title}
          onChange={(e) => onUpdateTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Tell others about yourself and what you're looking for..."
          value={description}
          onChange={(e) => onUpdateDescription(e.target.value)}
          rows={5}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Relationship Status</Label>
          <Select
            value={relationshipStatus}
            onValueChange={(value: "single" | "couple" | "other") => onUpdateRelationshipStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="couple">Couple</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyType">Body Type</Label>
          <Select value={bodyType} onValueChange={onUpdateBodyType}>
            <SelectTrigger>
              <SelectValue placeholder="Select body type" />
            </SelectTrigger>
            <SelectContent>
              {bodyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};
