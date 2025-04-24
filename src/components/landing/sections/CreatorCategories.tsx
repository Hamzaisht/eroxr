
import { motion } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Video Creators",
    description: "YouTubers, filmmakers, and video artists sharing exclusive content",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
    color: "from-purple-500/20 to-pink-500/20"
  },
  {
    title: "Artists & Illustrators",
    description: "Digital artists, painters, and illustrators sharing their creative process",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
    color: "from-blue-500/20 to-indigo-500/20"
  },
  {
    title: "Musicians",
    description: "Musicians sharing unreleased tracks, behind-the-scenes, and exclusive performances",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    title: "Writers & Podcasters",
    description: "Authors and podcasters sharing stories and exclusive episodes",
    image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc",
    color: "from-orange-500/20 to-amber-500/20"
  }
];

export const CreatorCategories = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 bg-luxury-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] opacity-10" />
      
      <div className="container mx-auto max-w-[1400px] px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent mb-6">
            Create What You Want
          </h2>
          <p className="text-lg text-luxury-neutral/80 max-w-2xl mx-auto">
            Join thousands of creators who are turning their passion into a sustainable income
          </p>
        </motion.div>

        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 mb-16"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-xl`} />
              <div className="relative overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-[300px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-white/80 mb-4">
                    {category.description}
                  </p>
                  <Button
                    variant="ghost"
                    className="w-fit bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    asChild
                  >
                    <Link to={`/category/${category.title.toLowerCase().replace(" ", "-")}`}>
                      Explore {category.title}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary text-white px-8 py-6 text-lg rounded-full"
            asChild
          >
            <Link to="/register">
              Start Your Creative Journey
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CreatorCategories;
