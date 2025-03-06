
import { useState } from "react";
import { motion } from "framer-motion";
import { AdFormValues } from "../types";
import { Check, AlertTriangle, Users, Calendar, MapPin, Heart, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { validateAdSubmission } from "../hooks/useAdValidation";

interface ReviewStepProps {
  values: AdFormValues;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ReviewStep = ({ values, onSubmit, isLoading }: ReviewStepProps) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    // Use the validation function from the hook
    const validation = validateAdSubmission(values);
    
    if (!validation.isValid && validation.error) {
      setValidationErrors([validation.error]);
      return;
    }
    
    setValidationErrors([]);
    onSubmit();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  const getRelationshipIcon = () => {
    switch (values.relationshipStatus) {
      case 'single':
        return <User className="h-4 w-4" />;
      case 'couple':
        return <Users className="h-4 w-4" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent inline-block mb-2">
          Review Your Ad
        </h3>
        <p className="text-sm text-muted-foreground">
          Please review your ad before submitting. Your ad will be reviewed by our team before it goes live.
        </p>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="p-6 rounded-xl border border-luxury-primary/20 bg-black/20 backdrop-blur-sm overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
            <Avatar className="h-24 w-24 mb-4 border-2 border-luxury-primary/30 shadow-[0_0_15px_rgba(155,135,245,0.3)]">
              <AvatarImage 
                src={values.avatarFile ? URL.createObjectURL(values.avatarFile) : undefined} 
                alt="Profile" 
              />
              <AvatarFallback>
                <User className="h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            
            <h2 className="text-xl font-bold mb-2">{values.title || "Untitled Ad"}</h2>
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="outline" className="bg-luxury-primary/10 text-luxury-primary border-luxury-primary/20 flex items-center gap-1">
                {getRelationshipIcon()}
                {values.relationshipStatus || "Single"}
              </Badge>
              <Badge variant="outline" className="bg-luxury-primary/10 text-luxury-primary border-luxury-primary/20 flex items-center gap-1">
                <Users className="h-4 w-4" />
                {values.bodyType ? values.bodyType.replace('_', ' ') : "Not specified"}
              </Badge>
              <Badge variant="outline" className="bg-luxury-primary/10 text-luxury-primary border-luxury-primary/20 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {values.ageRange.lower}-{values.ageRange.upper} y/o
              </Badge>
              <Badge variant="outline" className="bg-luxury-primary/10 text-luxury-primary border-luxury-primary/20 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {values.location || "No location"}
              </Badge>
            </div>
            
            <p className="text-sm text-luxury-neutral line-clamp-6 text-center md:text-left">
              {values.description || "No description provided."}
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-3">
            {values.videoFile ? (
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <video 
                  src={URL.createObjectURL(values.videoFile)} 
                  className="w-full h-full object-cover" 
                  controls 
                />
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-black/50 flex items-center justify-center">
                <p className="text-lg text-muted-foreground">No video uploaded</p>
              </div>
            )}
            
            <div className="mt-3">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-luxury-primary" />
                Looking For:
              </h4>
              <div className="flex flex-wrap gap-1">
                {values.lookingFor.length > 0 ? (
                  values.lookingFor.map((option) => (
                    <Badge key={option} className="bg-luxury-primary/10 text-luxury-primary border-luxury-primary/20 flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {option}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-red-400">No preferences selected</span>
                )}
              </div>
            </div>
            
            {values.tags.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-luxury-primary" />
                  Tags:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {values.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-black/20 text-muted-foreground">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {validationErrors.length > 0 && (
        <motion.div variants={itemVariants}>
          <Alert variant="destructive" className="mt-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-1">Please fix the following errors:</div>
              <ul className="list-disc pl-5">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
      
      <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 pt-4">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="px-6 py-5 border-luxury-primary/30 text-luxury-neutral"
          disabled={isLoading}
        >
          Edit Ad
        </Button>
        
        <Button
          className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-luxury-primary to-luxury-secondary 
            hover:from-luxury-secondary hover:to-luxury-primary transition-all duration-500
            hover:shadow-[0_0_20px_rgba(155,135,245,0.6)] group"
          size="lg"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Your Ad...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Check className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Create & Publish Ad
            </span>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};
