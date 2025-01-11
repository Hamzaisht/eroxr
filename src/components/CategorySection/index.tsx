import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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

        <div className="relative overflow-x-auto hide-scrollbar">
          <div 
            className="flex gap-4 py-4 px-2 overflow-x-auto scroll-smooth"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {categories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-none"
              >
                <Card className="w-[200px] p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border-luxury-primary/10 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                  <div className="text-4xl mb-4 transform transition-transform duration-300 relative">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold mb-2 text-luxury-primary relative">
                    {category.name}
                  </h3>
                  <p className="text-sm text-luxury-neutral relative">{category.count}</p>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-luxury-primary/20 to-transparent" />
        </div>

        <div className="text-center mt-8">
          <Button 
            size="lg" 
            variant="outline"
            className="hover:bg-luxury-primary hover:text-white transition-colors"
          >
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
};