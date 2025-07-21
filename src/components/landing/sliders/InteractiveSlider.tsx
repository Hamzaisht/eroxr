import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, PanInfo, AnimatePresence } from 'framer-motion';

interface SliderItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  gradient: string;
  icon?: string;
}

interface InteractiveSliderProps {
  items: SliderItem[];
  autoPlay?: boolean;
  autoPlayDelay?: number;
  className?: string;
}

export const InteractiveSlider = ({
  items,
  autoPlay = true,
  autoPlayDelay = 5000,
  className = ""
}: InteractiveSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, autoPlayDelay);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDelay, items.length]);

  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragStartX(info.point.x);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dragDistance = info.point.x - dragStartX;
    const threshold = 100;

    if (dragDistance > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (dragDistance < -threshold && currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }

    x.set(0);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative w-full h-96 overflow-hidden rounded-2xl ${className}`}>
      <div ref={constraintsRef} className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className={`absolute inset-0 ${items[currentIndex].gradient} p-8 flex items-center justify-between`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ x: springX }}
          >
            {/* Content */}
            <div className="flex-1 text-white z-10">
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {items[currentIndex].icon}
              </motion.div>
              
              <motion.h3
                className="text-3xl font-bold mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {items[currentIndex].title}
              </motion.h3>
              
              <motion.p
                className="text-lg opacity-90 max-w-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {items[currentIndex].description}
              </motion.p>
            </div>

            {/* Interactive Orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
              <motion.div
                className="w-32 h-32 bg-white rounded-full absolute top-8 right-8"
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, 20, 0],
                  y: [0, -10, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="w-20 h-20 bg-white rounded-full absolute bottom-8 right-20"
                animate={{
                  scale: [1, 1.3, 1],
                  x: [0, -15, 0],
                  y: [0, 15, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-20"
          disabled={currentIndex === 0}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all z-20"
          disabled={currentIndex === items.length - 1}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {items.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

// Card-based slider variant
interface CardSliderProps {
  items: SliderItem[];
  visibleCards?: number;
  className?: string;
}

export const CardSlider = ({
  items,
  visibleCards = 3,
  className = ""
}: CardSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const nextCards = () => {
    setCurrentIndex((prev) => 
      prev + visibleCards >= items.length ? 0 : prev + 1
    );
  };

  const prevCards = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, items.length - visibleCards) : prev - 1
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-6 overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: `${-currentIndex * (100 / visibleCards)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className={`min-w-0 flex-shrink-0 rounded-xl p-6 cursor-pointer relative overflow-hidden ${item.gradient}`}
              style={{ width: `${100 / visibleCards}%` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ scale: 1.05, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background Pattern */}
              <motion.div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at ${hoveredCard === index ? '50%' : '20%'} ${hoveredCard === index ? '50%' : '20%'}, white 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}
                animate={{
                  backgroundPosition: hoveredCard === index ? ['0px 0px', '20px 20px'] : '0px 0px'
                }}
                transition={{ duration: 2, repeat: hoveredCard === index ? Infinity : 0 }}
              />

              <div className="relative z-10 text-white">
                <motion.div
                  className="text-4xl mb-4"
                  animate={{ 
                    rotate: hoveredCard === index ? [0, 10, -10, 0] : 0 
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>
                
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-sm opacity-90">{item.description}</p>
              </div>

              {/* Hover Overlay */}
              <motion.div
                className="absolute inset-0 bg-white/10 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredCard === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center mt-8 gap-4">
        <motion.button
          onClick={prevCards}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        
        <motion.button
          onClick={nextCards}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          →
        </motion.button>
      </div>
    </div>
  );
};