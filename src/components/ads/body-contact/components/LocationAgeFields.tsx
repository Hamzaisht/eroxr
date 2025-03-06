
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationAgeFieldsProps {
  location: string;
  ageRange: { lower: number; upper: number };
  onUpdateLocation: (value: string) => void;
  onUpdateAgeRange: (value: { lower: number; upper: number }) => void;
}

export const LocationAgeFields = ({
  location,
  ageRange,
  onUpdateLocation,
  onUpdateAgeRange
}: LocationAgeFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Enter your city"
          value={location}
          onChange={(e) => onUpdateLocation(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Minimum Age</Label>
          <Input
            type="number"
            min="18"
            max="99"
            value={ageRange.lower}
            onChange={(e) => onUpdateAgeRange({ 
              ...ageRange, 
              lower: parseInt(e.target.value) 
            })}
          />
        </div>
        <div className="space-y-2">
          <Label>Maximum Age</Label>
          <Input
            type="number"
            min="18"
            max="99"
            value={ageRange.upper}
            onChange={(e) => onUpdateAgeRange({ 
              ...ageRange, 
              upper: parseInt(e.target.value) 
            })}
          />
        </div>
      </div>
    </>
  );
};
