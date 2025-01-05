import { CategorySection } from "@/components/CategorySection";

const Categories = () => {
  return (
    <div className="min-h-screen bg-luxury-dark py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Categories</h1>
        <CategorySection />
      </div>
    </div>
  );
};

export default Categories;