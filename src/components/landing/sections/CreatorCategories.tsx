import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { VideoPlayer } from "@/components/video/VideoPlayer";

const categories = [
  {
    title: "Video Creators",
    description: "YouTubers, filmmakers, and video artists sharing exclusive content",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
    video: "https://player.vimeo.com/external/328428416.hd.mp4?s=fa02b95f7a5d02bcdb3c5c435093a40a33671e99&profile_id=174&oauth2_token_id=57447761",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Artists & Illustrators",
    description: "Digital artists, painters, and illustrators sharing their creative process",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
    video: "https://player.vimeo.com/external/403594853.hd.mp4?s=8554e5e55ff20859b8f76293769e9ccb67db4921&profile_id=174&oauth2_token_id=57447761",
    color: "from-blue-500 to-indigo-500"
  },
  {
    title: "Musicians",
    description: "Musicians sharing unreleased tracks, behind-the-scenes, and exclusive performances",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
    video: "https://player.vimeo.com/external/534342299.hd.mp4?s=161c6eac7e5b37d440838607e2ae0d7e8b726027&profile_id=174&oauth2_token_id=57447761",
    color: "from-emerald-500 to-teal-500"
  },
  {
    title: "Writers & Podcasters",
    description: "Authors and podcasters sharing stories and exclusive episodes",
    image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc",
    video: "https://player.vimeo.com/external/370467553.hd.mp4?s=ce49c8c6d8e28a89298ffb4c53a2e842bdb01db9&profile_id=174&oauth2_token_id=57447761",
    color: "from-orange-500 to-amber-500"
  }
];

export const CreatorCategories = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dragConstraints, setDragConstraints] = useState({ right: 0 });

  useEffect(() => {
    const updateDragConstraints = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        setDragConstraints({ right: containerWidth - viewportWidth });
      }
    };

    updateDragConstraints();
    window.addEventListener('resize', updateDragConstraints);
    
    return () => {
      window.removeEventListener('resize', updateDragConstraints);
    };
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-luxury-darker z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5"></div>
      </div>
      
      <div className="w-full mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent mb-6">
            Create What You Want
          </h2>
          <p className="text-lg text-luxury-neutral/80">
            Join thousands of creators who are turning their passion into a sustainable income
          </p>
        </motion.div>
      </div>

      <motion.div 
        ref={containerRef}
        className="flex overflow-hidden cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={dragConstraints}
        whileTap={{ cursor: "grabbing" }}
      >
        <div className="flex pl-6 pr-20 space-x-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative w-[400px] h-[500px] flex-shrink-0"
              onHoverStart={() => setActiveIndex(index)}
              onHoverEnd={() => setActiveIndex(null)}
            >
              <div className="rounded-xl overflow-hidden h-full w-full relative group perspective">
                <motion.div
                  className="absolute inset-0 w-full h-full z-0 transition-all duration-500"
                  animate={{
                    rotateY: activeIndex === index ? 5 : 0,
                    rotateX: activeIndex === index ? -5 : 0,
                    scale: activeIndex === index ? 1.05 : 1
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="absolute inset-0 group-hover:opacity-0 transition-opacity duration-500">
                    <img 
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <VideoPlayer
                      url={category.video}
                      autoPlay
                      muted
                      loop
                      controls={false}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 z-10`} />
                </motion.div>
                
                <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                  <motion.h3 
                    className={`text-2xl font-bold text-white mb-2`}
                    animate={{ 
                      y: activeIndex === index ? -10 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {category.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-white/80 mb-6"
                    animate={{ 
                      opacity: activeIndex === index ? 1 : 0.8,
                      y: activeIndex === index ? -5 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {category.description}
                  </motion.p>
                  
                  <motion.div
                    animate={{ 
                      y: activeIndex === index ? -5 : 0,
                      opacity: activeIndex === index ? 1 : 0.8,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-fit bg-gradient-to-r ${category.color} bg-clip-text text-transparent border border-white/20 hover:border-white/40`}
                      asChild
                    >
                      <Link to={`/category/${category.title.toLowerCase().replace(" ", "-")}`}>
                        Explore {category.title}
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-16"
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
    </section>
  );
};

export default CreatorCategories;
