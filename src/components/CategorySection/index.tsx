import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

        <ScrollArea className="w-full whitespace-nowrap rounded-xl">
          <div className="flex w-max space-x-4 p-4">
            {categories.map((category) => (
              <motion.div
                key={category.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-none"
              >
                <Card className="w-[200px] p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border-luxury-primary/10">
                  <div className="text-4xl mb-4 transform transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold mb-2 text-luxury-primary">
                    {category.name}
                  </h3>
                  <p className="text-sm text-luxury-neutral">{category.count}</p>
                </Card>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="bg-luxury-primary/10" />
        </ScrollArea>

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