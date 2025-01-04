import { useState } from "react";
import { Search, TrendingUp, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatorCard } from "@/components/CreatorCard";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: creators, isLoading } = useQuery({
    queryKey: ["creators", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select(`
          id,
          username,
          avatar_url,
          creator_subscriptions(count)
        `);

      if (searchQuery) {
        query = query.ilike("username", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(creator => ({
        id: creator.id,
        name: creator.username || "Anonymous Creator",
        image: creator.avatar_url || "https://via.placeholder.com/400",
        description: "Content creator on our platform",
        subscribers: creator.creator_subscriptions?.[0]?.count || 0,
      })) || [];
    },
  });

  const { data: topCreators } = useQuery({
    queryKey: ["top-creators"],
    queryFn: async () => {
      // First, get the total count of creators to calculate top 5%
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const limit = Math.max(Math.ceil((count || 0) * 0.05), 5); // At least 5 creators

      // Get creators with their subscription counts using a subquery
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          avatar_url,
          (
            select count(*)
            from creator_subscriptions
            where creator_id = profiles.id
          ) as subscriber_count
        `)
        .order('subscriber_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(creator => ({
        id: creator.id,
        name: creator.username || "Anonymous Creator",
        image: creator.avatar_url || "https://via.placeholder.com/400",
        description: "Top performing creator",
        subscribers: creator.subscriber_count || 0,
      })) || [];
    },
    enabled: !!creators?.length,
  });

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,300px]">
          {/* Main Content */}
          <div className="space-y-8">
            <h1 className="bg-gradient-to-r from-luxury-primary to-luxury-secondary bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
              Discover Amazing Creators
            </h1>
            <div className="grid gap-6 md:grid-cols-2">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-[400px] animate-pulse rounded-lg bg-white/10" />
                ))
              ) : creators?.map((creator) => (
                <CreatorCard key={creator.id} {...creator} creatorId={creator.id} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8 rounded-xl bg-white/5 p-6 backdrop-blur-sm">
            {/* Search */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-luxury-primary" />
                <h2 className="text-xl font-semibold text-luxury-primary">
                  Search Creators
                </h2>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by @username"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 text-luxury-neutral"
                />
                <Button size="icon" variant="ghost">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Top Performers */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-luxury-primary" />
                <h2 className="text-xl font-semibold text-luxury-primary">
                  Top 5% Performers
                </h2>
              </div>
              <div className="space-y-4">
                {topCreators?.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex items-center gap-4 rounded-lg bg-white/10 p-4"
                  >
                    <img
                      src={creator.image}
                      alt={creator.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-luxury-neutral">
                        {creator.name}
                      </h3>
                      <p className="text-sm text-luxury-neutral/70">
                        {creator.subscribers} subscribers
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;