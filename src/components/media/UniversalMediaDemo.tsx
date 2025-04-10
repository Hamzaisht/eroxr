
import { useState } from "react";
import { UniversalMedia } from "./UniversalMedia";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export const UniversalMediaDemo = () => {
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [showMedia, setShowMedia] = useState<boolean>(false);
  
  const demoItems = [
    { 
      type: "image", 
      item: { 
        media_url: "https://images.unsplash.com/photo-1682687982029-edb9aecf5f89",
        alt_text: "Demo image" 
      } 
    },
    { 
      type: "video", 
      item: { 
        video_url: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
        media_type: "video" 
      } 
    },
    { 
      type: "storage", 
      item: { 
        media_url: "path/to/your/storage/image.jpg" // Replace with actual path in your storage
      } 
    }
  ];

  const handleLoadMedia = () => {
    if (!mediaUrl) return;
    setShowMedia(true);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Universal Media Demo</CardTitle>
        <CardDescription>Test rendering different types of media</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="demo">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Demo Media</TabsTrigger>
            <TabsTrigger value="custom">Custom URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demoItems.map((demo, index) => (
                <div key={index} className="border rounded-md p-2">
                  <h3 className="text-sm font-medium mb-2">{demo.type}</h3>
                  <div className="aspect-square">
                    <UniversalMedia 
                      item={demo.item} 
                      className="w-full h-full rounded-md overflow-hidden"
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 pt-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter media URL" 
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
              <Button onClick={handleLoadMedia}>Load</Button>
            </div>
            
            {showMedia && (
              <div className="aspect-video bg-black/20 rounded-md overflow-hidden">
                <UniversalMedia 
                  item={{ media_url: mediaUrl }}
                  className="w-full h-full" 
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
