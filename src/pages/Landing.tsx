import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Shield, Users, Lock, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

const Landing = () => {
  const navigate = useNavigate();
  const session = useSession();

  const handleGetStarted = () => {
    if (session) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-luxury-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-luxury-neutral to-luxury-primary bg-clip-text text-transparent mb-6">
              Connect with Verified Members
            </h1>
            <p className="text-xl text-luxury-neutral/80 mb-8">
              A secure and private platform for open-minded adults to connect and meet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-button-gradient hover:bg-hover-gradient"
                onClick={handleGetStarted}
              >
                Get Started
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-luxury-neutral text-luxury-neutral"
                onClick={() => navigate("/about")}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-luxury-dark/95" id="features">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center p-6"
            >
              <div className="h-12 w-12 rounded-full bg-luxury-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-luxury-primary" />
              </div>
              <h3 className="text-xl font-semibold text-luxury-neutral mb-2">Secure & Private</h3>
              <p className="text-luxury-neutral/60">Your privacy and security are our top priorities.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-6"
            >
              <div className="h-12 w-12 rounded-full bg-luxury-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-luxury-primary" />
              </div>
              <h3 className="text-xl font-semibold text-luxury-neutral mb-2">Verified Members</h3>
              <p className="text-luxury-neutral/60">All members are verified for your safety.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="h-12 w-12 rounded-full bg-luxury-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-luxury-primary" />
              </div>
              <h3 className="text-xl font-semibold text-luxury-neutral mb-2">Active Community</h3>
              <p className="text-luxury-neutral/60">Connect with like-minded individuals.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-20 bg-luxury-dark" id="safety">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-luxury-neutral mb-6">
              Your Safety Matters
            </h2>
            <p className="text-luxury-neutral/60 mb-8">
              We implement strict verification processes and security measures to ensure a safe environment for all members.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg border border-luxury-neutral/10 bg-luxury-dark/50">
                <Lock className="h-8 w-8 text-luxury-primary mb-4" />
                <h3 className="text-xl font-semibold text-luxury-neutral mb-2">
                  Identity Verification
                </h3>
                <p className="text-luxury-neutral/60">
                  All members go through a thorough verification process.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-luxury-neutral/10 bg-luxury-dark/50">
                <Shield className="h-8 w-8 text-luxury-primary mb-4" />
                <h3 className="text-xl font-semibold text-luxury-neutral mb-2">
                  Privacy Protection
                </h3>
                <p className="text-luxury-neutral/60">
                  Your personal information is encrypted and protected.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-luxury-dark border-t border-luxury-neutral/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-luxury-neutral font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-luxury-neutral/60">
                <li><button onClick={() => navigate("/features")} className="hover:text-luxury-neutral">Features</button></li>
                <li><button onClick={() => navigate("/safety")} className="hover:text-luxury-neutral">Safety</button></li>
                <li><button onClick={() => navigate("/verification")} className="hover:text-luxury-neutral">Verification</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-luxury-neutral font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-luxury-neutral/60">
                <li><button onClick={() => navigate("/about")} className="hover:text-luxury-neutral">About</button></li>
                <li><button onClick={() => navigate("/blog")} className="hover:text-luxury-neutral">Blog</button></li>
                <li><button onClick={() => navigate("/contact")} className="hover:text-luxury-neutral">Contact</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-luxury-neutral font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-luxury-neutral/60">
                <li><button onClick={() => navigate("/privacy")} className="hover:text-luxury-neutral">Privacy</button></li>
                <li><button onClick={() => navigate("/terms")} className="hover:text-luxury-neutral">Terms</button></li>
                <li><button onClick={() => navigate("/guidelines")} className="hover:text-luxury-neutral">Guidelines</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-luxury-neutral font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-luxury-neutral/60">
                <li><button onClick={() => navigate("/help")} className="hover:text-luxury-neutral">Help Center</button></li>
                <li><button onClick={() => navigate("/safety-tips")} className="hover:text-luxury-neutral">Safety Tips</button></li>
                <li><button onClick={() => navigate("/report")} className="hover:text-luxury-neutral">Report</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-luxury-neutral/10 text-center text-luxury-neutral/60">
            <p>© 2024 Eroxr. All rights reserved. Adults (18+) only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;