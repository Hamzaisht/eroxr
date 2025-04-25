
import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface Creator {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  subscribers: string;
  rating: number;
  category: string;
  preview: string;
}

export const CreatorShowcase = () => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  const creators: Creator[] = [
    {
      id: 1,
      name: "Scarlett Nova",
      handle: "@scarlettn",
      avatar: "/lovable-uploads/210f4161-ff9f-4874-8aad-93edd31b6e01.png",
      subscribers: "142K",
      rating: 4.9,
      category: "Fitness & Lifestyle",
      preview: "/lovable-uploads/210f4161-ff9f-4874-8aad-93edd31b6e01.png"
    },
    {
      id: 2,
      name: "Alex Mason",
      handle: "@alexmason",
      avatar: "/lovable-uploads/680a4cbf-2252-4c48-9aab-c7385de5b32d.png",
      subscribers: "98K",
      rating: 4.7,
      category: "Photography",
      preview: "/lovable-uploads/680a4cbf-2252-4c48-9aab-c7385de5b32d.png"
    },
    {
      id: 3,
      name: "Olivia Wilde",
      handle: "@oliviawilde",
      avatar: "/lovable-uploads/3afb027b-f83e-477f-b9aa-ee70f156546f.png",
      subscribers: "235K",
      rating: 5.0,
      category: "Art & Design",
      preview: "/lovable-uploads/3afb027b-f83e-477f-b9aa-ee70f156546f.png"
    },
    {
      id: 4,
      name: "David Chen",
      handle: "@davidchen",
      avatar: "/lovable-uploads/e754d33f-d841-445d-bc8a-537e1694f818.png",
      subscribers: "76K",
      rating: 4.8,
      category: "Music",
      preview: "/lovable-uploads/e754d33f-d841-445d-bc8a-537e1694f818.png"
    },
    {
      id: 5,
      name: "Emma Stone",
      handle: "@emmastone",
      avatar: "/lovable-uploads/210f4161-ff9f-4874-8aad-93edd31b6e01.png",
      subscribers: "187K",
      rating: 4.9,
      category: "Fashion",
      preview: "/lovable-uploads/210f4161-ff9f-4874-8aad-93edd31b6e01.png"
    }
  ];
  
  const handlePrev = () => {
    setActiveIndex(prev => 
      prev === 0 ? creators.length - 1 : prev - 1
    );
  };
  
  const handleNext = () => {
    setActiveIndex(prev => 
      prev === creators.length - 1 ? 0 : prev + 1
    );
  };
  
  const getCardClass = (index: number) => {
    const diff = (index - activeIndex + creators.length) % creators.length;
    
    if (diff === 0) return "z-30 scale-100 opacity-100 shadow-2xl";
    if (diff === 1 || diff === creators.length - 1) {
      return diff === 1 
        ? "z-20 scale-90 opacity-70 translate-x-[40%] -translate-y-[5%]"
        : "z-20 scale-90 opacity-70 -translate-x-[40%] -translate-y-[5%]";
    }
    return "z-10 scale-80 opacity-50 hidden md:block";
  };
  
  return (
    <section ref={containerRef} className="relative py-24 px-4 sm:px-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          style={{ y }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-luxury-neutral to-white bg-clip-text text-transparent">
            Meet Our Top Creators
          </h2>
          <p className="text-luxury-neutral text-lg max-w-2xl mx-auto">
            Join a vibrant community of talented creators sharing exclusive content
          </p>
        </motion.div>
        
        {/* 3D Creator Carousel */}
        <motion.div 
          className="relative h-[600px] flex items-center justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {/* Navigation Buttons */}
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-between z-40 px-4">
            <Button 
              onClick={handlePrev} 
              size="icon" 
              variant="ghost" 
              className="bg-luxury-dark/70 backdrop-blur-sm border border-luxury-primary/20 text-white hover:bg-luxury-primary/20 hover:text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button 
              onClick={handleNext} 
              size="icon" 
              variant="ghost"
              className="bg-luxury-dark/70 backdrop-blur-sm border border-luxury-primary/20 text-white hover:bg-luxury-primary/20 hover:text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Cards */}
          <div className="relative w-full h-full flex items-center justify-center">
            {creators.map((creator, index) => {
              const isActive = index === activeIndex;
              
              return (
                <HoverCard key={creator.id} openDelay={200} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <motion.div 
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px] h-[500px] bg-gradient-to-br from-luxury-dark to-luxury-darker border border-luxury-primary/20 rounded-xl overflow-hidden transition-all duration-500 ${getCardClass(index)}`}
                      layoutId={`creator-${creator.id}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: isActive ? 1 : index === (activeIndex + 1) % creators.length || index === (activeIndex - 1 + creators.length) % creators.length ? 0.7 : 0.5,
                        scale: isActive ? 1 : index === (activeIndex + 1) % creators.length || index === (activeIndex - 1 + creators.length) % creators.length ? 0.9 : 0.8,
                        x: isActive ? 0 : index === (activeIndex + 1) % creators.length ? 120 : index === (activeIndex - 1 + creators.length) % creators.length ? -120 : 0,
                        y: isActive ? 0 : index === (activeIndex + 1) % creators.length || index === (activeIndex - 1 + creators.length) % creators.length ? -20 : 0,
                        zIndex: isActive ? 30 : index === (activeIndex + 1) % creators.length || index === (activeIndex - 1 + creators.length) % creators.length ? 20 : 10,
                        rotateY: isActive ? 0 : index === (activeIndex + 1) % creators.length ? 5 : index === (activeIndex - 1 + creators.length) % creators.length ? -5 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 25,
                        delay: 0.1,
                      }}
                      whileHover={isActive ? { scale: 1.05, y: -10 } : {}}
                    >
                      {/* Creator Image */}
                      <div className="w-full h-3/4 relative overflow-hidden">
                        <img 
                          src={creator.preview}
                          alt={creator.name}
                          className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                        />
                      </div>
                      
                      {/* Creator Info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-luxury-darker via-luxury-darker/95 to-transparent p-5 backdrop-blur-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-white">{creator.name}</h3>
                            <p className="text-luxury-primary text-sm">{creator.handle}</p>
                            <div className="flex items-center mt-1">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="ml-1 text-luxury-neutral text-sm">{creator.rating}</span>
                              </div>
                              <span className="mx-2 text-luxury-neutral/50">•</span>
                              <span className="text-luxury-neutral text-sm">{creator.subscribers} fans</span>
                            </div>
                            <p className="text-sm text-luxury-neutral/70 mt-1">{creator.category}</p>
                          </div>
                          
                          {isActive && (
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary text-white"
                            >
                              Follow
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Highlight border for active card */}
                      {isActive && (
                        <motion.div 
                          className="absolute inset-0 z-[-1] rounded-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          style={{
                            background: "linear-gradient(to bottom right, rgba(155,135,245,0.3), rgba(217,70,239,0.3))",
                            filter: "blur(15px)"
                          }}
                        />
                      )}
                    </motion.div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 bg-luxury-darker border-luxury-primary/20 text-white p-0 overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-luxury-primary">
                          <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold">{creator.name}</h4>
                          <p className="text-sm text-luxury-primary">{creator.handle}</p>
                        </div>
                      </div>
                      <div className="text-sm text-luxury-neutral">
                        <p>Creating exclusive content in {creator.category}</p>
                        <p className="mt-2">Join {creator.subscribers} fans supporting this creator</p>
                      </div>
                      <div className="mt-4">
                        <Button className="w-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
          </div>
        </motion.div>
        
        {/* CTA */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link to="/creators">
            <Button 
              size="lg"
              className="bg-transparent border border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10 hover:text-white"
            >
              Discover More Creators
            </Button>
          </Link>
        </motion.div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-luxury-accent/5 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-luxury-primary/5 blur-3xl -z-10" />
    </section>
  );
};
