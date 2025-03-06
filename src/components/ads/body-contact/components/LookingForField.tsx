
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface LookingForFieldProps {
  lookingFor: string[];
  onUpdateLookingFor: (lookingFor: string[]) => void;
}

export const LookingForField = ({ lookingFor, onUpdateLookingFor }: LookingForFieldProps) => {
  const options = [
    { value: "male", label: "Men" },
    { value: "female", label: "Women" },
    { value: "couple", label: "Couples" },
    { value: "trans", label: "Trans" },
    { value: "group", label: "Groups" }
  ];

  const toggleOption = (value: string) => {
    if (lookingFor.includes(value)) {
      onUpdateLookingFor(lookingFor.filter(item => item !== value));
    } else {
      onUpdateLookingFor([...lookingFor, value]);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="font-medium">Looking For</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => toggleOption(option.value)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border transition-all",
              lookingFor.includes(option.value)
                ? "bg-luxury-primary/10 border-luxury-primary text-luxury-primary"
                : "border-border bg-background/60 hover:bg-background/80"
            )}
          >
            {lookingFor.includes(option.value) && (
              <Check className="h-4 w-4" />
            )}
            {option.label}
          </button>
        ))}
      </div>
      {lookingFor.length === 0 && (
        <p className="text-sm text-muted-foreground">Select at least one option</p>
      )}
    </div>
  );
};
