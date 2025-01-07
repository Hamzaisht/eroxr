import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-luxury-dark">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <section className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-secondary bg-clip-text text-transparent mb-6">
                About Our Platform
              </h1>
              <p className="text-luxury-neutral/80 text-lg">
                Connecting passionate creators with their dedicated audience
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-luxury-primary">Our Mission</h2>
              <p className="text-luxury-neutral/80">
                We believe in empowering creators to share their passion and build meaningful 
                connections with their audience. Our platform provides the tools and community 
                needed to turn creativity into a sustainable career.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-luxury-primary">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-lg bg-luxury-dark/50 border border-luxury-neutral/10">
                  <h3 className="text-xl font-semibold text-luxury-neutral mb-3">For Creators</h3>
                  <ul className="space-y-2 text-luxury-neutral/80">
                    <li>• Monetization tools</li>
                    <li>• Community management</li>
                    <li>• Analytics and insights</li>
                    <li>• Content protection</li>
                  </ul>
                </div>
                <div className="p-6 rounded-lg bg-luxury-dark/50 border border-luxury-neutral/10">
                  <h3 className="text-xl font-semibold text-luxury-neutral mb-3">For Supporters</h3>
                  <ul className="space-y-2 text-luxury-neutral/80">
                    <li>• Exclusive content</li>
                    <li>• Direct creator interaction</li>
                    <li>• Community participation</li>
                    <li>• Flexible subscription options</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="text-center">
              <h2 className="text-2xl font-bold text-luxury-primary mb-6">
                Ready to Join Our Community?
              </h2>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-button-gradient hover:bg-hover-gradient"
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/home")}
                  className="border-luxury-neutral text-luxury-neutral hover:bg-luxury-neutral/10"
                >
                  Explore Content
                </Button>
              </div>
            </section>
          </div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default About;
