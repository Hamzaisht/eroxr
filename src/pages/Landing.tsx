import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, CheckCircle2 } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-luxury-dark">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-luxury-dark/80 backdrop-blur-lg border-b border-luxury-neutral/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-luxury-neutral">Logo</div>
          <div className="hidden md:flex items-center gap-8 text-luxury-neutral/80">
            <a href="#features" className="hover:text-luxury-neutral transition-colors">Features</a>
            <a href="#creators" className="hover:text-luxury-neutral transition-colors">Creators</a>
            <a href="#about" className="hover:text-luxury-neutral transition-colors">About</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-luxury-neutral">
              Log in
            </Button>
            <Button className="bg-button-gradient hover:bg-hover-gradient">
              Get Started
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-luxury-gradient overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-luxury-neutral mb-6">
                Connect with your favorite creators
              </h1>
              <p className="text-xl text-luxury-neutral/80 mb-8">
                The ultimate platform for creators to share exclusive content and connect with their biggest fans
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-button-gradient hover:bg-hover-gradient">
                  Start Creating
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-luxury-neutral/20 text-luxury-neutral">
                  Explore Content
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                  alt="Creator"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/80 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-luxury-dark">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-luxury-neutral mb-4"
            >
              Everything You Need to Succeed
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-luxury-neutral/60 max-w-2xl mx-auto"
            >
              Tools and features designed to help you grow and engage with your audience
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Star className="h-6 w-6" />,
                title: "Exclusive Content",
                description: "Share premium content with your most dedicated fans"
              },
              {
                icon: <CheckCircle2 className="h-6 w-6" />,
                title: "Easy Monetization",
                description: "Multiple revenue streams to maximize your earnings"
              },
              {
                icon: <Star className="h-6 w-6" />,
                title: "Engagement Tools",
                description: "Connect with your audience through powerful features"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-luxury-dark/50 backdrop-blur-xl border border-luxury-neutral/10"
              >
                <div className="h-12 w-12 rounded-lg bg-luxury-primary/10 flex items-center justify-center mb-4">
                  <div className="text-luxury-primary">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-luxury-neutral mb-2">
                  {feature.title}
                </h3>
                <p className="text-luxury-neutral/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-luxury-dark border-y border-luxury-neutral/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Creators" },
              { number: "1M+", label: "Subscribers" },
              { number: "$10M+", label: "Earned" },
              { number: "150+", label: "Countries" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-luxury-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-luxury-neutral/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-luxury-dark">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-luxury-neutral mb-6">
              Start Your Creator Journey Today
            </h2>
            <p className="text-xl text-luxury-neutral/60 mb-8">
              Join thousands of creators who are building their future with us
            </p>
            <Button size="lg" className="bg-button-gradient hover:bg-hover-gradient">
              Get Started Now
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-luxury-dark border-t border-luxury-neutral/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-luxury-neutral font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-luxury-neutral/60">
                <li><a href="#" className="hover:text-luxury-neutral">Features</a></li>
                <li><a href="#" className="hover:text-luxury-neutral">Pricing</a></li>
                <li><a href="#" className="hover:text-luxury-neutral">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-luxury-neutral font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-luxury-neutral/60">
                <li><a href="#" className="hover:text-luxury-neutral">About</a></li>
                <li><a href="#" className="hover:text-luxury-neutral">Blog</a></li>
                <li><a href="#" className="hover:text-luxury-neutral">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-luxury-neutral font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-luxury-neutral/60">
                <li><a href="#" className="hover:text-luxury-neutral">Community</a></li>
                <li><a href="#" className="hover:text-luxury-neutral">Support</a></li>
                <li><a href="#" className="hover:text-luxury-neutral">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-luxury-neutral font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-luxury-neutral/60">
                <li><a href="#" className="hover:text-luxury-neutral">Privacy</a></li>
                <li><a href="#" className="hover:text-luxury-neutral">Terms</a></li>
                <li><a href="#" className="hover:text-luxury-neutral">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-luxury-neutral/10 text-center text-luxury-neutral/60">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;