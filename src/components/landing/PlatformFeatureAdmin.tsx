
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface PlatformFeature {
  id: string;
  feature_name: string;
  image_path: string;
  display_order: number;
  title: string;
  description: string;
}

const PlatformFeatureAdmin = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<PlatformFeature | null>(null);

  const { data: features, refetch } = useQuery({
    queryKey: ['platform-features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_features')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as PlatformFeature[];
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async (feature: PlatformFeature) => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    try {
      // Upload the file
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${feature.feature_name}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('platform-features')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Update the feature record
      const { error: updateError } = await supabase
        .from('platform_features')
        .update({ image_path: filePath })
        .eq('id', feature.id);

      if (updateError) throw updateError;

      toast.success('Screenshot updated successfully');
      setSelectedFile(null);
      refetch();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update screenshot');
    } finally {
      setUploading(false);
      setSelectedFeature(null);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">
            Manage Features
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage Platform Features</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {features?.map((feature) => (
              <div key={feature.id} className="space-y-2 p-4 border rounded-lg">
                <h3 className="font-medium">{feature.title}</h3>
                {feature.image_path && (
                  <img 
                    src={supabase.storage.from('platform-features').getPublicUrl(feature.image_path).data.publicUrl}
                    alt={feature.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
                <div className="space-y-2">
                  <Label htmlFor={`file-${feature.id}`}>Update screenshot</Label>
                  <Input
                    id={`file-${feature.id}`}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                  <Button
                    onClick={() => handleUpload(feature)}
                    disabled={!selectedFile || uploading}
                    className="w-full"
                  >
                    {uploading ? 'Uploading...' : 'Upload New Screenshot'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlatformFeatureAdmin;
