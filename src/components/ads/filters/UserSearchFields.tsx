
import { User, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterOptions } from "../types/dating";

interface UserSearchFieldsProps {
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const UserSearchFields = ({ 
  filterOptions, 
  setFilterOptions 
}: UserSearchFieldsProps) => {
  // Handle username search
  const handleUsernameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterOptions({
      ...filterOptions,
      username: value.length > 0 ? value : undefined
    });
  };

  // Handle city search
  const handleCitySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterOptions({
      ...filterOptions,
      city: value.length > 0 ? value : undefined
    });
  };

  return (
    <>
      {/* Username Search */}
      <div className="mb-6">
        <label className="text-sm font-medium text-luxury-neutral mb-2 block">Search by Username</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-neutral h-4 w-4" />
          <Input
            type="text"
            placeholder="Enter username..."
            className="pl-9 bg-luxury-darker border-luxury-primary/20 text-white"
            onChange={handleUsernameSearch}
            value={filterOptions.username || ""}
          />
        </div>
      </div>

      {/* Location Search */}
      <div className="mb-6">
        <label className="text-sm font-medium text-luxury-neutral mb-2 block">Search by Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-neutral h-4 w-4" />
          <Input
            type="text"
            placeholder="Enter city..."
            className="pl-9 bg-luxury-darker border-luxury-primary/20 text-white"
            onChange={handleCitySearch}
            value={filterOptions.city || ""}
          />
        </div>
      </div>
    </>
  );
};
