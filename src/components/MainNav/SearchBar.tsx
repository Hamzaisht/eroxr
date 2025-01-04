import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SearchBar = () => {
  return (
    <div className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search creators..."
        className="w-[300px] pl-9"
      />
    </div>
  );
};