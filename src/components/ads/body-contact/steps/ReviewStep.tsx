
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, Users, Tag } from "lucide-react";

interface ReviewStepProps {
  values: any;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ReviewStep = ({ values, onSubmit, isLoading }: ReviewStepProps) => {
  const getRelationshipStatusDisplay = (status: string) => {
    switch (status) {
      case 'single':
        return 'Single';
      case 'taken':
        return 'In a Relationship';
      case 'complicated':
        return "It's Complicated";
      default:
        return status;
    }
  };

  const getBodyTypeDisplay = (bodyType: string) => {
    return bodyType.charAt(0).toUpperCase() + bodyType.slice(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Review Your Profile</h2>
        <p className="text-gray-400">Make sure everything looks perfect before publishing</p>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white">{values.title}</h3>
        <p className="text-gray-300">{values.description}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {getRelationshipStatusDisplay(values.relationshipStatus)}
          </Badge>
          
          <Badge variant="secondary">
            {getBodyTypeDisplay(values.bodyType)}
          </Badge>

          <Badge variant="secondary" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {values.location}
          </Badge>

          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {values.ageRange?.lower}-{values.ageRange?.upper} years
          </Badge>
        </div>

        {values.lookingFor && values.lookingFor.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">Looking for:</h4>
            <div className="flex flex-wrap gap-1">
              {values.lookingFor.map((item: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {values.tags && values.tags.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Tags:
            </h4>
            <div className="flex flex-wrap gap-1">
              {values.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button 
        onClick={onSubmit} 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Publishing..." : "Publish My Profile"}
      </Button>
    </motion.div>
  );
};
