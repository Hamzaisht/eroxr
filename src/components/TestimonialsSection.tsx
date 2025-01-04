import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "This platform has transformed how I connect with my audience.",
    author: "Sarah Johnson",
    role: "Digital Artist",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  },
  {
    quote: "The best platform for creative professionals to monetize their work.",
    author: "Michael Chen",
    role: "Content Creator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  },
  {
    quote: "Finally, a platform that puts creators first!",
    author: "Emma Williams",
    role: "Lifestyle Coach",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-luxury-gradient">
      <div className="container">
        <h2 className="text-3xl font-bold text-center text-luxury-neutral mb-16 sm:text-4xl">
          Loved by Creators Worldwide
        </h2>
        
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-6 rounded-lg border border-luxury-neutral/10 bg-luxury-dark/50 backdrop-blur-xl"
            >
              <p className="text-luxury-neutral/80 mb-6">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-luxury-neutral">{testimonial.author}</p>
                  <p className="text-sm text-luxury-neutral/60">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};