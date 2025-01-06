import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatorCard } from "@/components/CreatorCard";
import { Loader2 } from "lucide-react";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query) return [];

      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*, posts(count)")
        .or(`username.ilike.%${query}%,bio.ilike.%${query}%`)
        .eq("profile_visibility", true)
        .limit(20);

      if (error) throw error;
      return profiles;
    },
    enabled: !!query,
  });

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">
          Enter a search term to find creators
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{query}"
      </h1>
      
      {searchResults?.length === 0 ? (
        <p className="text-center text-gray-500">
          No results found for "{query}"
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {searchResults?.map((profile) => (
            <CreatorCard
              key={profile.id}
              name={profile.username || "Anonymous"}
              image={profile.avatar_url || "/placeholder.svg"}
              banner="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
              description={profile.bio || "No bio available"}
              subscribers={0}
              creatorId={profile.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;