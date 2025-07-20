import { motion, useTransform, MotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Upload, Users } from "lucide-react";

interface StartYourPageProps {
  scrollYProgress: MotionValue<number>;
}

export const StartYourPage = ({ scrollYProgress }: StartYourPageProps) => {
  const [ref, inView] = useInView({ threshold: 0.3 });

  const y = useTransform(scrollYProgress, [0.7, 1], [100, -100]);

  return (
    <section ref={ref} className="relative min-h-screen py-20 bg-gradient-to-b from-black via-purple-950/30 to-black">
      <motion.div 
        style={{ y }}
        className="max-w-7xl mx-auto px-6"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        </div>

        {/* Main CTA Block */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="relative text-center"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Start Your{" "}
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Page
              </span>
            </h2>
            <p className="text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Launch your page in 30 seconds. Already have content? Import in 1 click.
            </p>
          </motion.div>

          {/* CTA Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Become a Creator */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group"
            >
              <motion.div
                className="relative bg-gradient-to-br from-pink-600/20 to-purple-600/20 backdrop-blur-sm border border-pink-400/30 rounded-2xl p-8 text-center"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(236, 72, 153, 0.5)",
                  boxShadow: "0 20px 40px rgba(236, 72, 153, 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Upload className="w-10 h-10 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  Launch Your Creator Business
                </h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Turn your passion into profit. Join creators earning $1K-$50K+ monthly with our proven monetization tools and dedicated fan base.
                </p>

                <Button
                  className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 border-0 rounded-xl"
                >
                  Create Your Page
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-pink-400 rounded-full opacity-60"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Browse Creators */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="group"
            >
              <motion.div
                className="relative bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-sm border border-cyan-400/30 rounded-2xl p-8 text-center"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(34, 211, 238, 0.5)",
                  boxShadow: "0 20px 40px rgba(34, 211, 238, 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <motion.div
                  className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  whileHover={{ rotate: -360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Users className="w-10 h-10 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  Discover Premium Content
                </h3>
                <p className="text-white/70 mb-6 leading-relaxed">
                  Access exclusive content from top creators. Connect directly with your favorite artists, podcasters, and influencers.
                </p>

                <Button
                  className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border-0 rounded-xl"
                >
                  Explore Creators
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full opacity-60"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 0.5
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Quick Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="bg-gray-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-yellow-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">Why creators choose EROXR</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">85%</div>
                <p className="text-white/70">Revenue Share</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">30s</div>
                <p className="text-white/70">Setup Time</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-400 mb-2">24/7</div>
                <p className="text-white/70">Support</p>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-white/60 text-sm">
              Free account creation • No upfront costs • Cancel anytime • 18+ only
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};