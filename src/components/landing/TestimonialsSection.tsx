import { motion, useInView } from "framer-motion";
import { Star, Quote, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface Testimonial {
  id: string;
  type: 'text' | 'video';
  user: {
    name: string;
    username: string;
    avatar: string;
    role: 'creator' | 'fan';
    verified: boolean;
  };
  content: string;
  rating: number;
  date: string;
  videoThumbnail?: string;
  metrics?: {
    earnings?: string;
    followers?: string;
    satisfaction?: string;
  };
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    type: "text",
    user: {
      name: "Luna Martinez",
      username: "lunamartinez",
      avatar: "/api/placeholder/60/60",
      role: "creator",
      verified: true
    },
    content: "EROXR completely transformed my creative career. The 85% revenue share is unmatched, and I've earned over $45K in just 6 months. The platform is so user-friendly and the support team is incredible!",
    rating: 5,
    date: "2 days ago",
    metrics: {
      earnings: "$45,000+",
      followers: "12.5K",
    }
  },
  {
    id: "2",
    type: "video",
    user: {
      name: "Jake Thompson",
      username: "jakethompson",
      avatar: "/api/placeholder/60/60",
      role: "fan",
      verified: true
    },
    content: "The content quality on EROXR is amazing. I love supporting my favorite creators directly, and the platform makes it so easy to discover new talent.",
    rating: 5,
    date: "1 week ago",
    videoThumbnail: "/api/placeholder/400/300",
    metrics: {
      satisfaction: "100%"
    }
  },
  {
    id: "3",
    type: "text",
    user: {
      name: "Sophia Rose",
      username: "sophiarose",
      avatar: "/api/placeholder/60/60",
      role: "creator",
      verified: true
    },
    content: "I switched from other platforms to EROXR and my income tripled! The analytics dashboard helps me understand my audience better, and the instant payouts are a game changer.",
    rating: 5,
    date: "3 days ago",
    metrics: {
      earnings: "$28,500+",
      followers: "8.3K",
    }
  }
];

export const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (!isInView || !isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isInView, isAutoPlay]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlay(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
      />
    ));
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-amber-900/5 to-black" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-display font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-yellow-200 bg-clip-text text-transparent">
            Loved by Creators & Fans
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See why thousands of creators and millions of fans choose EROXR as their platform of choice
          </p>
        </motion.div>

        {/* Featured Testimonial Slider */}
        <motion.div
          className="relative mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="relative overflow-hidden rounded-3xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="glass-card-heavy rounded-3xl p-8 md:p-12 border border-white/10">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                      
                      {/* User Info */}
                      <div className="flex-shrink-0">
                        <div className="flex items-center gap-4 mb-6">
                          <img 
                            src={testimonial.user.avatar} 
                            alt={testimonial.user.name}
                            className="w-16 h-16 rounded-full border-2 border-white/20"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold text-white">{testimonial.user.name}</h3>
                              {testimonial.user.verified && (
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-400">@{testimonial.user.username}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                testimonial.user.role === 'creator' 
                                  ? 'bg-purple-600/20 text-purple-300' 
                                  : 'bg-blue-600/20 text-blue-300'
                              }`}>
                                {testimonial.user.role === 'creator' ? 'Creator' : 'Fan'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Metrics */}
                        {testimonial.metrics && (
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            {Object.entries(testimonial.metrics).map(([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="text-2xl font-bold text-white">{value}</div>
                                <div className="text-sm text-gray-400 capitalize">{key}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        {testimonial.type === 'video' && testimonial.videoThumbnail ? (
                          <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 group cursor-pointer">
                            <img 
                              src={testimonial.videoThumbnail} 
                              alt="Video testimonial"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <motion.div 
                                className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Play className="w-6 h-6 text-white ml-1" />
                              </motion.div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative mb-6">
                            <Quote className="absolute -top-4 -left-2 w-8 h-8 text-purple-400/50" />
                            <p className="text-xl text-gray-300 leading-relaxed pl-6">
                              {testimonial.content}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {renderStars(testimonial.rating)}
                          </div>
                          <span className="text-gray-400 text-sm">{testimonial.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlay(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-purple-500 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </motion.div>

        {/* Success Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {[
            { value: "4.9/5", label: "Average Rating", icon: "⭐" },
            { value: "50K+", label: "Happy Creators", icon: "👥" },
            { value: "$4.2M+", label: "Monthly Earnings", icon: "💰" },
            { value: "99.8%", label: "Satisfaction Rate", icon: "❤️" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center glass-card rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};