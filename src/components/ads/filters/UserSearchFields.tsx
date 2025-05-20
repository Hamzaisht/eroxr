
import { useState } from "react";
import { Search } from "lucide-react";
import { FilterOptions } from "../types/dating";
import { FilterAccordion } from "./FilterAccordion";

interface UserSearchFieldsProps {
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
}

export const UserSearchFields = ({ 
  filterOptions, 
  setFilterOptions 
}: UserSearchFieldsProps) => {
  const [usernameInput, setUsernameInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  // Handle username search
  const handleUsernameSearch = () => {
    if (usernameInput.trim()) {
      setFilterOptions({
        ...filterOptions,
        username: usernameInput.trim()
      });
    } else {
      // Remove username from filter if input is empty
      const { username, ...rest } = filterOptions;
      setFilterOptions({
        ...rest,
        username: "" // Set empty string instead of removing to match FilterOptions type
      });
    }
  };

  // Handle keyword search
  const handleKeywordSearch = () => {
    if (keywordInput.trim()) {
      setFilterOptions({
        ...filterOptions,
        keyword: keywordInput.trim()
      });
    } else {
      // Remove keyword from filter if input is empty
      const { keyword, ...rest } = filterOptions;
      setFilterOptions({
        ...rest,
        keyword: "" // Set empty string instead of removing to match FilterOptions type
      });
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Username Search */}
      <div>
        <label htmlFor="username-search" className="text-sm font-medium text-luxury-neutral mb-2 block">
          Search by Username
        </label>
        <div className="relative">
          <input
            id="username-search"
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUsernameSearch()}
            placeholder="Enter username"
            className="w-full bg-luxury-darker border border-luxury-primary/10 rounded-md px-3 py-2 text-white text-sm placeholder-luxury-muted focus:outline-none focus:ring-1 focus:ring-luxury-primary/50"
          />
          <button
            onClick={handleUsernameSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-luxury-primary p-1 rounded-md"
            aria-label="Search by username"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Keyword Search */}
      <div>
        <label htmlFor="keyword-search" className="text-sm font-medium text-luxury-neutral mb-2 block">
          Search by Keyword
        </label>
        <div className="relative">
          <input
            id="keyword-search"
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleKeywordSearch()}
            placeholder="Enter keyword"
            className="w-full bg-luxury-darker border border-luxury-primary/10 rounded-md px-3 py-2 text-white text-sm placeholder-luxury-muted focus:outline-none focus:ring-1 focus:ring-luxury-primary/50"
          />
          <button
            onClick={handleKeywordSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-luxury-muted hover:text-luxury-primary p-1 rounded-md"
            aria-label="Search by keyword"
          >
            <Search size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
