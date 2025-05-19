import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { extractProfile as extractCreator } from "@/utils/supabase/helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, MapPin, Eye, Heart, MessageCircle, Share2 } from "lucide-react";

interface DemoProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const TempDemoContent: React.FC<DemoProps> = ({
  title,
  description,
  children,
}) => {
  const [activeTab, setActiveTab] = useState("feed");
  const [isLoading, setIsLoading] = useState(false);

  const { data: creators } = useQuery({
    queryKey: ["featured-creators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "creator")
        .limit(5);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["recent-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `*, 
          creator:creator_id(username, avatar_url, id_verification_status)`
        )
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    // Simulate loading state
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {["feed", "explore", "trending", "following"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardHeader>
                  <div className="h-5 w-2/3 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {activeTab === "feed" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts?.map((post) => {
                  const creator = extractCreator(post.creator);
                  return (
                    <Card key={post.id} className="overflow-hidden">
                      {post.media_url && post.media_url[0] && (
                        <div className="aspect-video bg-muted">
                          <img
                            src={post.media_url[0]}
                            alt="Post media"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader className="flex flex-row items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={creator?.avatar_url || ""}
                            alt={creator?.username || "User"}
                          />
                          <AvatarFallback>
                            {creator?.username?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {creator?.username || "Anonymous"}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-3">{post.content}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex gap-3">
                          <Button variant="ghost" size="icon">
                            <Heart className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MessageCircle className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Share2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}

            {activeTab === "explore" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {creators?.map((creator) => (
                  <Card key={creator.id} className="overflow-hidden">
                    <div
                      className="h-24 bg-cover bg-center"
                      style={{
                        backgroundImage: creator.banner_url
                          ? `url(${creator.banner_url})`
                          : "linear-gradient(to right, #4a5568, #2d3748)",
                      }}
                    />
                    <CardHeader className="pt-0 relative">
                      <div className="absolute -top-12 left-4 border-4 border-background rounded-full">
                        <Avatar className="h-20 w-20">
                          <AvatarImage
                            src={creator.avatar_url || ""}
                            alt={creator.username || "Creator"}
                          />
                          <AvatarFallback>
                            {creator.username?.[0]?.toUpperCase() || "C"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="pt-10">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">
                            {creator.username || "Anonymous Creator"}
                          </h3>
                          {creator.id_verification_status === "verified" && (
                            <Check className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {creator.bio || "No bio available"}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {creator.interests?.slice(0, 3).map((interest, i) => (
                          <Badge key={i} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">View Profile</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === "trending" && (
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold">Trending Content</h3>
                  </CardHeader>
                  <CardContent>
                    <p>Trending content will appear here.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "following" && (
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-bold">Following Feed</h3>
                  </CardHeader>
                  <CardContent>
                    <p>Content from creators you follow will appear here.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}

        {children}
      </div>
    </div>
  );
};
