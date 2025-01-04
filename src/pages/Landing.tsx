import { motion } from "framer-motion";
import { HeroSection } from "@/components/landing/HeroSection";
import { InteractiveFeatures } from "@/components/landing/InteractiveFeatures";
import { AnimatedStats } from "@/components/landing/AnimatedStats";
import { CreatorShowcase } from "@/components/landing/CreatorShowcase";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-luxury-dark overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-luxury-dark/80 backdrop-blur-lg border-b border-luxury-neutral/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-luxury-neutral"
          >
            Logo
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center gap-8 text-luxury-neutral/80"
          >
            <a href="#features" className="hover:text-luxury-neutral transition-colors">
              Features
            </a>
            <a href="#creators" className="hover:text-luxury-neutral transition-colors">
              Creators
            </a>
            <a href="#pricing" className="hover:text-luxury-neutral transition-colors">
              Pricing
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Button variant="ghost" className="text-luxury-neutral">
              Log in
            </Button>
            <Button className="bg-button-gradient hover:bg-hover-gradient group">
              Get Started
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <HeroSection />
        <InteractiveFeatures />
        <AnimatedStats />
        <CreatorShowcase />
      </main>

      {/* Footer */}
      <footer className="bg-luxury-dark border-t border-luxury-neutral/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-luxury-neutral font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-luxury-neutral/60">
                <li>
                  <a href="#" className="hover:text-luxury-neutral">Features</a>
                </li>
                <li>
                  <a href="#" className="hover:text-luxury-neutral">Pricing</a>
                </li>
                <li>
                  <a href="#" className="hover:text-luxury-neutral">Documentation</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-luxury-neutral font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-luxury-neutral/60">
                <li>
                  <a href="#" className="hover:text-luxury-neutral">About</a>
                </li>
                <li>
                  <a href="#" className="hover:text-luxury-neutral">Blog</a>
                </li>
                <li>
                  <a href="#" className="hover:text-luxury-neutral">Careers</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-luxury-neutral font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-luxury-neutral/60">
                <li>
                  <a href="#" className="hover:text-luxury-neutral">Community</a>
                </li>
                <li>
                  <a href="#" className="hover:text-luxury-neutral">Support</a>
                </li>
                <li>
                  <a href="#" className="hover:text-luxury-neutral">Status</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-luxury-neutral font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-luxury-neutral/60">
                <li>
                  <a href="#" className="hover:text-luxury-neutral">Privacy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-luxury-neutral">Terms</a>
                </li>
                <li>
                  <a href="#" className="hover:text-luxury-neutral">Security</a>
                </li>
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