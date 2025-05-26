
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusBodyTypeSelectsProps {
  relationshipStatus: string;
  bodyType: string;
  onRelationshipStatusChange: (value: string) => void;
  onBodyTypeChange: (value: string) => void;
}

export const StatusBodyTypeSelects = ({
  relationshipStatus,
  bodyType,
  onRelationshipStatusChange,
  onBodyTypeChange
}: StatusBodyTypeSelectsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="relationship-status">Relationship Status</Label>
        <Select value={relationshipStatus} onValueChange={onRelationshipStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="taken">Taken</SelectItem>
            <SelectItem value="complicated">It's Complicated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="body-type">Body Type</Label>
        <Select value={bodyType} onValueChange={onBodyTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select body type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="slim">Slim</SelectItem>
            <SelectItem value="average">Average</SelectItem>
            <SelectItem value="curvy">Curvy</SelectItem>
            <SelectItem value="athletic">Athletic</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
