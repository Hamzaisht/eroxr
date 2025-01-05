import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const SearchBar = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return { creators: [], posts: [] };

      const [creatorsResponse, postsResponse] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, username, avatar_url")
          .ilike("username", `%${searchQuery}%`)
          .limit(5),
        supabase
          .from("posts")
          .select("id, content, creator_id, profiles(username, avatar_url)")
          .ilike("content", `%${searchQuery}%`)
          .limit(5),
      ]);

      return {
        creators: creatorsResponse.data || [],
        posts: postsResponse.data || [],
      };
    },
    enabled: searchQuery.length > 0,
  });

  return (
    <>
      <div className="relative w-full max-w-sm">
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-2 h-10 px-4 rounded-md bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white/80 hover:border-white/20 transition-colors"
        >
          <Search className="h-4 w-4" />
          <span>Search creators and posts...</span>
        </button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search creators and posts..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {isLoading && (
            <CommandEmpty>Searching...</CommandEmpty>
          )}
          
          {!isLoading && !searchResults?.creators.length && !searchResults?.posts.length && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {searchResults?.creators.length > 0 && (
            <CommandGroup heading="Creators">
              {searchResults.creators.map((creator) => (
                <CommandItem
                  key={creator.id}
                  onSelect={() => {
                    navigate(`/profile/${creator.id}`);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={creator.avatar_url || "/placeholder.svg"}
                      alt={creator.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{creator.username}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {searchResults?.posts.length > 0 && (
            <CommandGroup heading="Posts">
              {searchResults.posts.map((post) => (
                <CommandItem
                  key={post.id}
                  onSelect={() => {
                    // TODO: Implement post view page
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={post.profiles?.avatar_url || "/placeholder.svg"}
                      alt={post.profiles?.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {post.profiles?.username}
                      </span>
                      <span className="text-xs text-white/60 truncate max-w-[200px]">
                        {post.content}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};