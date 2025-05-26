
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileBannerProps {
  bannerUrl?: string;
  isEditable?: boolean;
}

export const ProfileBanner = ({ bannerUrl, isEditable = false }: ProfileBannerProps) => {
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Coming soon",
      description: "Banner upload functionality will be available soon"
    });
  };

  return (
    <Card className="relative h-48 overflow-hidden">
      {bannerUrl ? (
        <img 
          src={bannerUrl} 
          alt="Profile banner" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
      )}
      
      {isEditable && (
        <Button
          size="sm"
          variant="outline"
          className="absolute top-4 right-4"
          onClick={handleUpload}
        >
          <Camera className="h-4 w-4 mr-2" />
          Change Banner
        </Button>
      )}
    </Card>
  );
};
