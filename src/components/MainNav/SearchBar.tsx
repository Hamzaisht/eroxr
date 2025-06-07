
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
    <div className="relative w-full max-w-sm">
      {/* Background glow effect - subtle for nav */}
      <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/10 via-luxury-accent/10 to-luxury-secondary/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <form onSubmit={handleSearch} className="relative group">
        <div className="relative overflow-hidden rounded-xl border border-luxury-primary/20 bg-luxury-darker/60 backdrop-blur-xl shadow-lg hover:shadow-luxury-primary/15 transition-all duration-300">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/3 via-transparent to-luxury-accent/3 animate-pulse" />
          
          {/* Floating particles effect - smaller for nav */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1 left-2 w-0.5 h-0.5 bg-luxury-primary rounded-full animate-bounce delay-100" />
            <div className="absolute top-2 right-4 w-0.5 h-0.5 bg-luxury-accent rounded-full animate-bounce delay-300" />
            <div className="absolute bottom-1 left-6 w-0.5 h-0.5 bg-luxury-secondary rounded-full animate-bounce delay-500" />
          </div>
          
          <div className="relative flex items-center p-0.5">
            {/* Search icon with glow - smaller for nav */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-luxury-primary to-luxury-accent shadow-md shadow-luxury-primary/20 ml-1">
              <Search className="h-3 w-3 text-white" />
            </div>
            
            {/* Input container */}
            <div className="flex-1 relative mx-2">
              <div className="flex items-center">
                <AtSign className="h-3 w-3 text-luxury-primary mr-1 flex-shrink-0" />
                <Input
                  type="search"
                  placeholder="Search creators..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="bg-transparent border-none text-white placeholder:text-luxury-muted focus:ring-0 focus:outline-none text-sm font-medium h-6"
                />
              </div>
              
              {/* Typing indicator line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-primary to-transparent transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300" />
            </div>
            
            {/* Submit button - smaller for nav */}
            <Button 
              type="submit" 
              size="icon"
              className="w-7 h-7 rounded-lg bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary shadow-md shadow-luxury-primary/30 border-0 mr-1 group/btn transition-all duration-300 hover:scale-105"
            >
              <ArrowRight className="h-3 w-3 text-white group-hover/btn:translate-x-0.5 transition-transform duration-200" />
            </Button>
          </div>
        </div>
        
        {/* Helper text - smaller and positioned for nav */}
        <div className="absolute top-full left-0 right-0 flex items-center justify-center mt-1 text-xs text-luxury-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles className="h-2 w-2 mr-1" />
          <span className="text-xs">Search with @</span>
        </div>
      </form>
    </div>
  );
};
