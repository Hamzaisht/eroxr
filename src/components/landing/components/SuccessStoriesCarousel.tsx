
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { throttle } from "@/utils/throttle";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { LazyImage } from "./LazyImage";

const successStories = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Digital Artist",
    story: "Since joining EROXR, I've tripled my monthly income and built an engaged community that truly values my work.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    stats: {
      subscribers: "10,000+",
      revenue: "$12,000/mo",
      growth: "350%"
    }
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Content Creator",
    story: "EROXR's platform tools helped me automate my content schedule, allowing me to focus on creating better content for my audience.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    stats: {
      subscribers: "25,000+",
      revenue: "$30,000/mo",
      growth: "520%"
    }
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Lifestyle Coach",
    story: "The direct connection with my audience through EROXR has completely transformed my coaching business model for the better.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    stats: {
      subscribers: "8,000+",
      revenue: "$15,000/mo",
      growth: "280%"
    }
  }
];

export const SuccessStoriesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  const nextSlide = throttle(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % successStories.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, 500);
  
  const prevSlide = throttle(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => prevIndex === 0 ? successStories.length - 1 : prevIndex - 1);
    setTimeout(() => setIsAnimating(false), 500);
  }, 500);
  
  // Auto play carousel
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [nextSlide, prefersReducedMotion]);
  
  // Pause auto play on hover
  const handleMouseEnter = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };
  
  const handleMouseLeave = () => {
    if (prefersReducedMotion) return;
    
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    autoPlayRef.current = setInterval(nextSlide, 6000);
  };
  
  const current = successStories[currentIndex];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Creator <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="text-luxury-neutral/80 max-w-2xl mx-auto text-lg">
            See how creators transformed their careers on EROXR
          </p>
        </motion.div>
        
        <div
          ref={carouselRef}
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="grid md:grid-cols-2 gap-8 relative">
            <div className="flex flex-col justify-center">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: prefersReducedMotion ? 0 : 30 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <LazyImage 
                      src={current.image} 
                      alt={current.name} 
                      height={64}
                      width={64}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold">{current.name}</h3>
                    <p className="text-luxury-neutral/80">{current.role}</p>
                  </div>
                </div>
                
                <p className="text-lg font-display italic">"{current.story}"</p>
                
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {Object.entries(current.stats).map(([key, value]) => (
                    <div key={key} className="text-center p-3 rounded-lg bg-luxury-primary/5 border border-luxury-primary/20">
                      <p className="text-xs text-luxury-neutral/70 uppercase">{key}</p>
                      <p className="text-lg font-display font-semibold gradient-text">{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <motion.div
              key={`image-${current.id}`}
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-xl overflow-hidden h-[400px]"
            >
              <LazyImage 
                src={current.image} 
                alt={current.name}
                className="h-full w-full"
              />
            </motion.div>
          </div>
          
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-luxury-primary/10 hover:bg-luxury-primary/20 flex items-center justify-center transition-colors"
              aria-label="Previous story"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-2">
              {successStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentIndex === index 
                      ? "bg-luxury-primary" 
                      : "bg-luxury-primary/30 hover:bg-luxury-primary/50"
                  }`}
                  aria-label={`Go to story ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-luxury-primary/10 hover:bg-luxury-primary/20 flex items-center justify-center transition-colors"
              aria-label="Next story"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesCarousel;
