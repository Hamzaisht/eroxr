
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface CreateDatingAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdCreationSuccess: () => void;
}

export const CreateDatingAdDialog = ({
  open,
  onOpenChange,
  onAdCreationSuccess
}: CreateDatingAdDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    age_lower: 25,
    age_upper: 45,
    relationship_status: "single",
    looking_for: ["female"],
    country: "sweden",
    city: "Stockholm"
  });
  const { toast } = useToast();
  const session = useSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please login to create an ad",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('dating_ads')
        .insert([
          {
            user_id: session.user.id,
            title: formData.title,
            description: formData.description,
            age_range: `[${formData.age_lower},${formData.age_upper}]`,
            relationship_status: formData.relationship_status,
            looking_for: Array.isArray(formData.looking_for) ? formData.looking_for : [formData.looking_for],
            country: formData.country,
            city: formData.city,
            user_type: formData.relationship_status,
            is_active: true,
            moderation_status: "pending"
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Ad created successfully",
        description: "Your ad has been submitted for review",
      });
      
      onOpenChange(false);
      onAdCreationSuccess();
      
    } catch (error) {
      console.error("Error creating dating ad:", error);
      toast({
        title: "Error creating ad",
        description: "Failed to create your ad. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Dating Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Profile Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-luxury-primary/10 rounded-md bg-luxury-darker"
              required
              maxLength={60}
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-luxury-primary/10 rounded-md bg-luxury-darker"
              rows={4}
              required
              maxLength={500}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="relationship_status" className="block text-sm font-medium mb-1">I am a</label>
              <select
                id="relationship_status"
                name="relationship_status"
                value={formData.relationship_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-luxury-primary/10 rounded-md bg-luxury-darker"
                required
              >
                <option value="single">Single</option>
                <option value="couple">Couple</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="looking_for" className="block text-sm font-medium mb-1">Looking for</label>
              <select
                id="looking_for"
                name="looking_for"
                value={formData.looking_for[0]}
                onChange={(e) => setFormData({ ...formData, looking_for: [e.target.value] })}
                className="w-full px-3 py-2 border border-luxury-primary/10 rounded-md bg-luxury-darker"
                required
              >
                <option value="male">Men</option>
                <option value="female">Women</option>
                <option value="couple">Couples</option>
                <option value="any">Anyone</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="age_lower" className="block text-sm font-medium mb-1">Age From</label>
              <input
                type="number"
                id="age_lower"
                name="age_lower"
                value={formData.age_lower}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-luxury-primary/10 rounded-md bg-luxury-darker"
                min={18}
                max={99}
                required
              />
            </div>
            
            <div>
              <label htmlFor="age_upper" className="block text-sm font-medium mb-1">Age To</label>
              <input
                type="number"
                id="age_upper"
                name="age_upper"
                value={formData.age_upper}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-luxury-primary/10 rounded-md bg-luxury-darker"
                min={18}
                max={99}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-luxury-primary/10 rounded-md bg-luxury-darker"
                required
              >
                <option value="denmark">Denmark</option>
                <option value="finland">Finland</option>
                <option value="iceland">Iceland</option>
                <option value="norway">Norway</option>
                <option value="sweden">Sweden</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-luxury-primary/10 rounded-md bg-luxury-darker"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-luxury-primary"
            >
              {isSubmitting ? "Creating..." : "Create Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
