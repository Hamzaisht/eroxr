import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export const CreateBodyContactDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState<"single" | "couple" | "other">("single");
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const session = useSession();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to create a body contact ad",
        variant: "destructive",
      });
      return;
    }

    if (!title || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from("dating_ads")
      .insert({
        user_id: session.user.id,
        title,
        description,
        relationship_status: relationshipStatus,
        looking_for: lookingFor,
        country: "sweden", // Default values for demo
        city: "Stockholm",
        age_range: [25, 45],
        user_type: relationshipStatus === "couple" ? "couple_mf" : "male",
        is_active: true,
      });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create body contact ad",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Your body contact ad has been created",
    });
    setOpen(false);
    setTitle("");
    setDescription("");
    setRelationshipStatus("single");
    setLookingFor([]);
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary text-white"
      >
        Create Body Contact
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="space-y-6 p-6">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Create Body Contact Ad
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a catchy title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell others about yourself and what you're looking for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Relationship Status</Label>
                <Select
                  value={relationshipStatus}
                  onValueChange={(value: "single" | "couple" | "other") => setRelationshipStatus(value)}
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

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Ad"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};