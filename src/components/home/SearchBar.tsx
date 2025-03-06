
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Enhanced regex to match all relationship tag patterns
      const isRelationshipTag = /^(M|F|MF)4(M|F|MF|T|A)$/i.test(searchQuery.trim());
      
      if (isRelationshipTag) {
        // Redirect to dating page with the tag as a query parameter
        navigate(`/dating?tag=${encodeURIComponent(searchQuery.trim().toUpperCase())}`);
      } else {
        // Regular search
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-6">
      <div className="relative flex items-center gap-2 group">
        <Input
          type="search"
          placeholder="Search or enter relationship tag (e.g., M4F, F4A, MF4MF)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-luxury-dark/30 border-luxury-neutral/10 focus:ring-2 focus:ring-luxury-primary/50 
                     transition-all duration-300 hover:bg-luxury-dark/40"
        />
        <Button 
          type="submit" 
          size="icon" 
          variant="ghost"
          className="absolute right-2 hover:bg-luxury-neutral/10 text-foreground 
                   group-hover:text-luxury-primary transition-colors duration-300"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
