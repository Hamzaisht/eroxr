
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { CirclePlay, CircleUser, Image, MessageCircle, Zap } from "lucide-react";

export const FeaturesSection = () => {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  const features = [
    {
      icon: <CirclePlay className="w-8 h-8" />,
      title: "Livestreams & Premium Access",
      description:
        "Stream in HD quality directly to your subscribers. Set pay-per-view rates or include in subscription tiers for premium content access.",
      color: "from-pink-500 to-luxury-primary",
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: "Shortform Eros Videos",
      description:
        "Create viral TikTok-style videos with our easy-to-use editor. Reach new audiences with trending shorts optimized for engagement.",
      color: "from-luxury-primary to-luxury-accent",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Private Messaging",
      description:
        "Connect personally with subscribers through encrypted, secure messaging. Send direct content with pay-per-view options.",
      color: "from-luxury-accent to-blue-400",
    },
    {
      icon: <CircleUser className="w-8 h-8" />,
      title: "Snap/Story Uploads",
      description:
        "Share limited-time content that disappears after 24 hours. Perfect for behind-the-scenes moments and quick updates.",
      color: "from-blue-400 to-green-400",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Payouts & Earnings Transparency",
      description:
        "Track your earnings in real-time with our detailed analytics dashboard. Fast, reliable payouts with multiple withdrawal options.",
      color: "from-green-400 to-yellow-400",
    },
  ];
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  // Function to handle 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on mouse position
    // Reduced intensity for more subtle effect (7 degrees max)
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Add glow effect positioning
    const glow = card.querySelector('.card-glow') as HTMLElement;
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(155, 135, 245, 0.4) 0%, transparent 70%)`;
    }
  };

  // Function to reset transform on mouse leave
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    
    // Reset glow
    const glow = card.querySelector('.card-glow') as HTMLElement;
    if (glow) {
      glow.style.background = 'transparent';
    }
  };
  
  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 bg-luxury-darker/50"
    >
      <div className="container mx-auto max-w-7xl" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          style={{ y: y1 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Powerful Features
            </span>{" "}
            <span className="text-white">for Creators</span>
          </h2>
          <p className="text-luxury-neutral text-lg max-w-2xl mx-auto">
            Everything you need to create, share, and monetize your content
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-luxury-dark to-luxury-darker border-0 p-6 group hover:shadow-[0_0_30px_rgba(155,135,245,0.15)] transition-all duration-500"
              custom={i}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              style={{ y: i % 2 === 0 ? y2 : y3 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Feature Icon */}
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-5`}>
                {feature.icon}
              </div>
              
              {/* Feature Title */}
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-luxury-primary transition-colors">
                {feature.title}
              </h3>
              
              {/* Feature Description */}
              <p className="text-luxury-neutral">
                {feature.description}
              </p>
              
              {/* 3D Interactive glow effect */}
              <div className="card-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              {/* Futuristic border effect */}
              <div className="absolute inset-0 border border-luxury-primary/0 rounded-xl group-hover:border-luxury-primary/30 transition-all duration-500"></div>
              
              {/* Futuristic corner accents */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-luxury-primary/0 group-hover:border-luxury-primary/50 rounded-tr-lg transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-luxury-primary/0 group-hover:border-luxury-primary/50 rounded-bl-lg transition-all duration-500"></div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-gradient-to-r from-luxury-primary/10 to-luxury-accent/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-luxury-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-luxury-accent/5 rounded-full blur-3xl -z-10" />
      
      {/* Grid background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 -z-10" />
    </section>
  );
};
