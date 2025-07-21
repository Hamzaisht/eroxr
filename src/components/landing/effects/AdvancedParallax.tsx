import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  offset?: ["start end", "end start"] | ["start start", "end end"];
}

export const ParallaxSection = ({ 
  children, 
  speed = 0.5, 
  className = "",
  offset = ["start end", "end start"] as const
}: ParallaxSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScrollTriggeredAnimationProps {
  children: ReactNode;
  animationType?: 'fade' | 'slide' | 'scale' | 'rotate' | 'flip';
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

export const ScrollTriggeredAnimation = ({
  children,
  animationType = 'fade',
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className = ""
}: ScrollTriggeredAnimationProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.3 0.5"]
  });

  const getAnimationProps = () => {
    switch (animationType) {
      case 'fade':
        return {
          opacity: useTransform(scrollYProgress, [0, 1], [0, 1]),
          y: useTransform(scrollYProgress, [0, 1], direction === 'up' ? [50, 0] : [-50, 0])
        };
      case 'slide':
        return {
          x: useTransform(scrollYProgress, [0, 1], 
            direction === 'left' ? [-100, 0] : 
            direction === 'right' ? [100, 0] : [0, 0]
          ),
          y: useTransform(scrollYProgress, [0, 1], 
            direction === 'up' ? [100, 0] : 
            direction === 'down' ? [-100, 0] : [0, 0]
          ),
          opacity: useTransform(scrollYProgress, [0, 1], [0, 1])
        };
      case 'scale':
        return {
          scale: useTransform(scrollYProgress, [0, 1], [0.8, 1]),
          opacity: useTransform(scrollYProgress, [0, 1], [0, 1])
        };
      case 'rotate':
        return {
          rotate: useTransform(scrollYProgress, [0, 1], [-45, 0]),
          opacity: useTransform(scrollYProgress, [0, 1], [0, 1])
        };
      case 'flip':
        return {
          rotateY: useTransform(scrollYProgress, [0, 1], [90, 0]),
          opacity: useTransform(scrollYProgress, [0, 1], [0, 1])
        };
      default:
        return {
          opacity: useTransform(scrollYProgress, [0, 1], [0, 1])
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      style={getAnimationProps()}
      className={className}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
};

interface StaggeredAnimationProps {
  children: ReactNode[];
  stagger?: number;
  className?: string;
}

export const StaggeredAnimation = ({
  children,
  stagger = 0.1,
  className = ""
}: StaggeredAnimationProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.5 0.5"]
  });

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          style={{
            opacity: useTransform(scrollYProgress, [0, 1], [0, 1]),
            y: useTransform(scrollYProgress, [0, 1], [30, 0])
          }}
          transition={{ delay: index * stagger }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

interface MouseParallaxProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
}

export const MouseParallax = ({
  children,
  intensity = 0.1,
  className = ""
}: MouseParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={(e) => {
        if (!ref.current) return;
        
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * intensity;
        const y = (e.clientY - rect.top - rect.height / 2) * intensity;
        
        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }}
      onMouseLeave={() => {
        if (!ref.current) return;
        ref.current.style.transform = 'translate3d(0, 0, 0)';
      }}
      style={{
        transition: 'transform 0.2s ease-out'
      }}
    >
      {children}
    </motion.div>
  );
};

interface InfiniteScrollProps {
  items: ReactNode[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

export const InfiniteScroll = ({
  items,
  speed = 50,
  direction = 'left',
  className = ""
}: InfiniteScrollProps) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%']
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear'
          }
        }}
      >
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};