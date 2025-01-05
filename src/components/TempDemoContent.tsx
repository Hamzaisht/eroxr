import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DemoContent {
  id: string;
  content_type: string;
  title: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

export const TempDemoContent = () => {
  const { data: demoContent } = useQuery({
    queryKey: ["demo-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("temp_demo_content")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      return data as DemoContent[];
    },
    refetchInterval: 10000, // Refetch every 10 seconds to check for expired content
  });

  if (!demoContent?.length) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary">Demo Content</h2>
        <p className="text-muted-foreground">This content will disappear in 2 minutes!</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {demoContent.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={item.image_url}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src={item.image_url} />
                  <AvatarFallback>
                    {item.title.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.content_type === 'featured_creator' ? 'Creator' : 'Post'}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};