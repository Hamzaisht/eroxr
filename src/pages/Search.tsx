// Update only the CreatorCard usage to fix the type errors
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreatorCard } from "@/components/CreatorCard";
import { Search as SearchIcon } from "lucide-react";

// Define CreatorCardProps interface to match what's expected by CreatorCard
interface CreatorCardProps {
  creator: {
    id: string;
    username: string;
    avatarUrl: string;
    bannerUrl: string;
    bio: string;
    subscriberCount: number;
  }
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // Simulate fetching data from an API
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockResults = Array.from({ length: itemsPerPage }, (_, i) => ({
          id: `creator-${page}-${i}`,
          name: `Creator ${searchQuery} ${page}-${i}`,
          image: `https://source.unsplash.com/random/100x100?sig=${page * itemsPerPage + i}`,
          banner: "https://source.unsplash.com/random/800x200",
          description: `A cool creator who searches for ${searchQuery}`,
          subscribers: Math.floor(Math.random() * 1000),
        }));

        setResults(mockResults);
        setTotalPages(5); // Simulate total pages
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, page, itemsPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset page when search query changes
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto py-6">
      {/* Search Form */}
      <div className="flex items-center space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Search creators..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-grow"
        />
        <Button>
          <SearchIcon className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full mt-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results?.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={{
                  id: creator.id,
                  username: creator.name,
                  avatarUrl: creator.image,
                  bannerUrl: creator.banner,
                  bio: creator.description,
                  subscriberCount: creator.subscribers
                }}
              />
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                onClick={() => handlePageChange(i + 1)}
                disabled={loading}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="creators">
          <p>Specific creator results will go here.</p>
        </TabsContent>
        
        <TabsContent value="categories">
          <p>Category-specific results will go here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
