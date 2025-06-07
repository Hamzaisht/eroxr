
import { Search, AtSign, Sparkles, ArrowRight } from "lucide-react";
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
        // Regular search - clean up username (remove @ if present)
        const cleanQuery = searchQuery.trim().replace(/^@/, '');
        navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Auto-add @ if user starts typing without it
    if (value.length === 1 && value !== '@' && !value.startsWith('@')) {
      value = '@' + value;
    }
    setSearchQuery(value);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/20 via-luxury-accent/20 to-luxury-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <form onSubmit={handleSearch} className="relative group">
        <div className="relative overflow-hidden rounded-2xl border border-luxury-primary/20 bg-luxury-darker/80 backdrop-blur-xl shadow-2xl hover:shadow-luxury-primary/25 transition-all duration-500">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/5 via-transparent to-luxury-accent/5 animate-pulse" />
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-2 left-4 w-1 h-1 bg-luxury-primary rounded-full animate-bounce delay-100" />
            <div className="absolute top-4 right-8 w-1 h-1 bg-luxury-accent rounded-full animate-bounce delay-300" />
            <div className="absolute bottom-3 left-12 w-1 h-1 bg-luxury-secondary rounded-full animate-bounce delay-500" />
          </div>
          
          <div className="relative flex items-center p-1">
            {/* Search icon with glow */}
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-luxury-primary to-luxury-accent shadow-lg shadow-luxury-primary/30 ml-2">
              <Search className="h-5 w-5 text-white" />
            </div>
            
            {/* Input container */}
            <div className="flex-1 relative mx-4">
              <div className="flex items-center">
                <AtSign className="h-4 w-4 text-luxury-primary mr-2 flex-shrink-0" />
                <Input
                  type="search"
                  placeholder="Search creators by username..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="bg-transparent border-none text-white placeholder:text-luxury-muted focus:ring-0 focus:outline-none text-lg font-medium"
                />
              </div>
              
              {/* Typing indicator line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-primary to-transparent transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300" />
            </div>
            
            {/* Submit button */}
            <Button 
              type="submit" 
              size="icon"
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary shadow-lg shadow-luxury-primary/40 border-0 mr-2 group/btn transition-all duration-300 hover:scale-105"
            >
              <ArrowRight className="h-5 w-5 text-white group-hover/btn:translate-x-0.5 transition-transform duration-200" />
            </Button>
          </div>
        </div>
        
        {/* Helper text */}
        <div className="flex items-center justify-center mt-3 text-xs text-luxury-muted">
          <Sparkles className="h-3 w-3 mr-1" />
          <span>Search with @ to find creators instantly</span>
        </div>
      </form>
    </div>
  );
};
