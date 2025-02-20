import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Users, Radio } from 'lucide-react';
import type { FeaturedCreator, PlatformNews, LiveStream } from '../types/featured-content';

const ROTATION_INTERVAL = 5000; // 5 seconds

export const RotatingContentPanel = () => {
  const [activeSection, setActiveSection] = useState(0);
  const queryClient = useQueryClient();

  const { data: featuredContent } = useQuery({
    queryKey: ['featured-content'],
    queryFn: async () => {
      const [creatorsResponse, newsResponse, streamsResponse] = await Promise.all([
        supabase
          .from('profiles_with_stats')
          .select('*')
          .eq('is_exclusive', true)
          .order('subscriber_count', { ascending: false })
          .limit(5),
        supabase
          .from('platform_news')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('live_streams')
          .select('*, creator:profiles(id, username, avatar_url)')
          .eq('status', 'live')
          .order('viewer_count', { ascending: false })
          .limit(5)
      ]);

      return {
        creators: creatorsResponse.data as FeaturedCreator[],
        news: newsResponse.data as PlatformNews[],
        streams: streamsResponse.data as LiveStream[]
      };
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSection((prev) => (prev + 1) % 3);
    }, ROTATION_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  // Real-time updates subscription
  useEffect(() => {
    const channel = supabase
      .channel('featured-content-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'platform_news' 
      }, () => {
        queryClient.invalidateQueries({ queryKey: ['featured-content'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="h-full bg-black/20 backdrop-blur-sm rounded-r-xl overflow-hidden">
      <Carousel>
        <CarouselContent>
          {/* Exclusive Creators Section */}
          <CarouselItem className={activeSection === 0 ? 'block' : 'hidden'}>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-luxury-primary" />
                Exclusive Creators
              </h3>
              <ScrollArea className="h-[calc(100vh-150px)]">
                <div className="space-y-4">
                  {featuredContent?.creators.map((creator) => (
                    <Card key={creator.id} className="bg-black/40 border-0 p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16 border-2 border-luxury-primary">
                            <AvatarImage src={creator.avatar_url || ""} />
                            <AvatarFallback>{creator.username[0]}</AvatarFallback>
                          </Avatar>
                          {creator.status === 'live' && (
                            <Badge className="absolute -top-2 -right-2 bg-red-500">LIVE</Badge>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium flex items-center gap-2">
                            {creator.username}
                            <Badge variant="outline" className="bg-luxury-primary/20">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Exclusive
                            </Badge>
                          </h4>
                          <p className="text-white/60 text-sm">
                            {creator.subscriber_count.toLocaleString()} subscribers
                          </p>
                        </div>
                        <Button variant="secondary" size="sm">
                          Follow
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CarouselItem>

          {/* News & Updates Section */}
          <CarouselItem className={activeSection === 1 ? 'block' : 'hidden'}>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-luxury-primary" />
                Latest Updates
              </h3>
              <ScrollArea className="h-[calc(100vh-150px)]">
                <div className="space-y-4">
                  {featuredContent?.news.map((news) => (
                    <Card key={news.id} className="bg-black/40 border-0 p-4">
                      {news.image_url && (
                        <img 
                          src={news.image_url} 
                          alt={news.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h4 className="text-white font-medium">{news.title}</h4>
                      <p className="text-white/60 text-sm mt-2">{news.content}</p>
                      {news.cta && (
                        <Button 
                          variant="secondary" 
                          className="mt-4 w-full"
                          onClick={() => window.location.href = news.cta!.url}
                        >
                          {news.cta.text}
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CarouselItem>

          {/* Live Streams Section */}
          <CarouselItem className={activeSection === 2 ? 'block' : 'hidden'}>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-luxury-primary" />
                Live Now
              </h3>
              <ScrollArea className="h-[calc(100vh-150px)]">
                <div className="space-y-4">
                  {featuredContent?.streams.map((stream) => (
                    <Card key={stream.id} className="bg-black/40 border-0 p-4">
                      <div className="relative">
                        <img 
                          src={stream.thumbnail_url} 
                          alt={stream.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Badge className="absolute top-2 left-2 bg-red-500 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {stream.viewer_count}
                        </Badge>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={stream.creator.avatar_url || ""} />
                          <AvatarFallback>{stream.creator.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{stream.title}</h4>
                          <p className="text-white/60 text-sm">{stream.creator.username}</p>
                        </div>
                        <Button variant="secondary" size="sm">
                          Watch
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};
