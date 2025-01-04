import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const categories = [
  {
    name: "Art & Illustration",
    icon: "🎨",
    count: "2.4k creators",
  },
  {
    name: "Photography",
    icon: "📸",
    count: "1.8k creators",
  },
  {
    name: "Music",
    icon: "🎵",
    count: "3.2k creators",
  },
  {
    name: "Writing",
    icon: "✍️",
    count: "1.5k creators",
  },
  {
    name: "Gaming",
    icon: "🎮",
    count: "4.1k creators",
  },
  {
    name: "Education",
    icon: "📚",
    count: "2.1k creators",
  },
];

export const CategorySection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover amazing creators across different categories and find the
            content that resonates with you
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="font-semibold mb-2">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.count}</p>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button size="lg" variant="outline">
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
};