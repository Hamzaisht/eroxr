import { motion, useTransform, MotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { InteractiveSlider, CardSlider } from "@/components/landing/sliders/InteractiveSlider";
import { ParallaxSection, ScrollTriggeredAnimation } from "@/components/landing/effects/AdvancedParallax";

interface CreatorShowcaseProps {
  scrollYProgress: MotionValue<number>;
}

export const CreatorShowcase = ({ scrollYProgress }: CreatorShowcaseProps) => {
  const [ref, inView] = useInView({ threshold: 0.2 });

  const sliderItems = [
    {
      id: "sarah",
      title: "Sarah Chen",
      description: "Lifestyle & Beauty • $45K/month • 250K subscribers",
      gradient: "bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700",
      icon: "✨"
    },
    {
      id: "marcus", 
      title: "Marcus Rivera",
      description: "Fitness & Wellness • $38K/month • 180K subscribers",
      gradient: "bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700",
      icon: "💪"
    },
    {
      id: "emma",
      title: "Emma Thompson", 
      description: "Tech & Innovation • $52K/month • 320K subscribers",
      gradient: "bg-gradient-to-br from-green-600 via-emerald-600 to-green-700",
      icon: "🚀"
    },
    {
      id: "alex",
      title: "Alex Kim",
      description: "Art & Design • $29K/month • 150K subscribers", 
      gradient: "bg-gradient-to-br from-orange-600 via-red-600 to-orange-700",
      icon: "🎨"
    }
  ];

  const creators = [
    {
      name: "Sarah Chen",
      category: "Lifestyle & Beauty",
      earnings: "$45K/month",
      subscribers: "250K",
      image: "https://images.unsplash.com/photo-1494790108755-2616c27c0e2a?w=400&h=400&fit=crop&crop=face",
      verified: true,
      growth: "+35%"
    },
    {
      name: "Marcus Rivera",
      category: "Fitness & Wellness", 
      earnings: "$38K/month",
      subscribers: "180K",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      verified: true,
      growth: "+42%"
    },
    {
      name: "Emma Thompson",
      category: "Tech & Innovation",
      earnings: "$52K/month", 
      subscribers: "320K",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      verified: true,
      growth: "+28%"
    },
    {
      name: "Alex Kim",
      category: "Art & Design",
      earnings: "$29K/month",
      subscribers: "150K", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      verified: true,
      growth: "+51%"
    }
  ];

  const parallaxY1 = useTransform(scrollYProgress, [0.1, 0.5], [0, -50]);
  const parallaxY2 = useTransform(scrollYProgress, [0.2, 0.6], [0, -30]);

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      
      <ParallaxSection speed={0.3}>
        <motion.div 
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl"
        />
      </ParallaxSection>
      
      <ParallaxSection speed={0.5}>
        <motion.div 
          className="absolute bottom-32 left-20 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-lg"
        />
      </ParallaxSection>

      <div className="container mx-auto px-6 relative z-10">
        <ScrollTriggeredAnimation animationType="fade" direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Meet Our
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Star Creators
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of creators who have transformed their passion into thriving businesses on our platform.
            </p>
          </div>
        </ScrollTriggeredAnimation>

        {/* Interactive Slider */}
        <ScrollTriggeredAnimation animationType="scale" delay={0.3}>
          <div className="mb-16">
            <InteractiveSlider 
              items={sliderItems}
              autoPlay={true}
              autoPlayDelay={4000}
              className="max-w-4xl mx-auto"
            />
          </div>
        </ScrollTriggeredAnimation>

        {/* Card Slider for Creators */}
        <ScrollTriggeredAnimation animationType="slide" direction="up" delay={0.5}>
          <div className="mb-16">
            <CardSlider 
              items={sliderItems}
              visibleCards={3}
              className="max-w-6xl mx-auto"
            />
          </div>
        </ScrollTriggeredAnimation>

        {/* Enhanced Creator Grid with Micro Interactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {creators.map((creator, index) => (
            <ScrollTriggeredAnimation 
              key={index}
              animationType="slide" 
              direction="up" 
              delay={index * 0.1}
            >
              <motion.div
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 20px 40px rgba(139, 92, 246, 0.15)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated Background Pattern */}
                <motion.div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                  animate={{
                    backgroundPosition: ['0px 0px', '20px 20px']
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                />

                <div className="relative mb-4">
                  <motion.img
                    src={creator.image}
                    alt={creator.name}
                    className="w-20 h-20 rounded-full mx-auto border-2 border-purple-400/50"
                    whileHover={{ 
                      scale: 1.1,
                      borderColor: 'rgba(139, 92, 246, 0.8)'
                    }}
                  />
                  {creator.verified && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
                </div>

                <div className="text-center">
                  <motion.h3 
                    className="text-xl font-bold text-white mb-2"
                    whileHover={{ color: '#a855f7' }}
                  >
                    {creator.name}
                  </motion.h3>
                  <p className="text-purple-400 text-sm mb-3">{creator.category}</p>
                  
                  <div className="space-y-2">
                    <motion.div 
                      className="flex justify-between items-center"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-gray-400 text-sm">Earnings</span>
                      <span className="text-green-400 font-semibold">{creator.earnings}</span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between items-center"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-gray-400 text-sm">Subscribers</span>
                      <span className="text-white font-semibold">{creator.subscribers}</span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between items-center"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-gray-400 text-sm">Growth</span>
                      <span className="text-emerald-400 font-semibold">{creator.growth}</span>
                    </motion.div>
                  </div>
                </div>

                {/* Interactive Hover Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-pink-600/0 rounded-2xl"
                  whileHover={{ 
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)'
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </ScrollTriggeredAnimation>
          ))}
        </div>

        {/* Enhanced CTA with Magnetic Effect */}
        <ScrollTriggeredAnimation animationType="scale" delay={0.8}>
          <div className="text-center">
            <motion.button
              className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Join the Creator Economy
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </div>
        </ScrollTriggeredAnimation>
      </div>
    </section>
  );
};