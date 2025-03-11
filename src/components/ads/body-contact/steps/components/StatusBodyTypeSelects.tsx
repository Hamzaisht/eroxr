
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatusBodyTypeSelectsProps {
  relationshipStatus: string;
  bodyType: string;
  onRelationshipStatusChange: (status: "single" | "couple" | "other") => void;
  onBodyTypeChange: (bodyType: string) => void;
}

export const StatusBodyTypeSelects = ({
  relationshipStatus,
  bodyType,
  onRelationshipStatusChange,
  onBodyTypeChange
}: StatusBodyTypeSelectsProps) => {
  const bodyTypes = [
    "athletic", "average", "slim", "curvy", "muscular", "plus_size"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div className="space-y-2">
        <Label htmlFor="status" className="text-luxury-neutral">Relationship Status</Label>
        <Select
          value={relationshipStatus}
          onValueChange={(value: "single" | "couple" | "other") => onRelationshipStatusChange(value)}
        >
          <SelectTrigger className="bg-black/20 border-luxury-primary/20 
            focus:border-luxury-primary/50 transition-all duration-300 hover:border-luxury-primary/30">
            <SelectValue placeholder="Select your status" />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-md border-luxury-primary/20">
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="couple">Couple</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bodyType" className="text-luxury-neutral">Body Type</Label>
        <Select 
          value={bodyType} 
          onValueChange={(value) => onBodyTypeChange(value)}
        >
          <SelectTrigger className="bg-black/20 border-luxury-primary/20 
            focus:border-luxury-primary/50 transition-all duration-300 hover:border-luxury-primary/30">
            <SelectValue placeholder="Select body type" />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-md border-luxury-primary/20">
            {bodyTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};
