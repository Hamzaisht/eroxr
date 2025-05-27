
import { EroboardCard } from "@/components/eroboard/EroboardCard";
import { EroboardFilters } from "@/components/eroboard/EroboardFilters";
import { useState } from "react";

const Eroboard = () => {
  const [filters, setFilters] = useState({
    category: '',
    sortBy: 'recent'
  });

  // Mock data for now
  const mockPosts = [
    {
      id: "1",
      title: "Sample Post",
      description: "This is a sample post description",
      creator: "Creator Name",
      views: 1250,
      likes: 89,
      createdAt: new Date(),
      thumbnail: ""
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Eroboard</h1>
        <p className="text-gray-400">Discover trending content and creators</p>
      </div>
      
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <EroboardFilters filters={filters} onFiltersChange={setFilters} />
        </div>
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPosts.map((post) => (
              <EroboardCard key={post.id} post={post} />
            ))}
          </div>
          
          {mockPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No posts found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Eroboard;
