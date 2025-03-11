
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TitleDescriptionInputsProps {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

export const TitleDescriptionInputs = ({ 
  title, 
  description, 
  onTitleChange, 
  onDescriptionChange 
}: TitleDescriptionInputsProps) => {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <Label htmlFor="title" className="text-luxury-neutral">Title</Label>
        <Input
          id="title"
          placeholder="Enter a catchy title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 focus:ring-luxury-primary/20
            transition-all duration-300 hover:border-luxury-primary/30"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <Label htmlFor="description" className="text-luxury-neutral">Description</Label>
        <Textarea
          id="description"
          placeholder="Tell others about yourself and what you're looking for..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={5}
          className="bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 focus:ring-luxury-primary/20
            resize-none transition-all duration-300 hover:border-luxury-primary/30"
        />
      </motion.div>
    </>
  );
};
