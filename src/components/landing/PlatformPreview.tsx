
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const PlatformPreview = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-luxury-neutral mb-4">
            A Platform Built for Creators
          </h2>
          <p className="text-luxury-neutral/60 max-w-2xl mx-auto">
            Experience our powerful tools and features designed to help you succeed
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass-morph p-6 rounded-xl">
              <img 
                src="/chat-preview.png" 
                alt="Chat Interface"
                className="rounded-lg shadow-lg w-full"
              />
              <h3 className="text-xl font-semibold mt-4 mb-2">Engage With Your Community</h3>
              <p className="text-luxury-neutral/60">Connect with your fans through live chat, comments, and private messages</p>
            </div>
            
            <div className="glass-morph p-6 rounded-xl">
              <img 
                src="/content-preview.png" 
                alt="Content Management"
                className="rounded-lg shadow-lg w-full"
              />
              <h3 className="text-xl font-semibold mt-4 mb-2">Share Your Content</h3>
              <p className="text-luxury-neutral/60">Upload and manage your content with our intuitive tools</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass-morph p-6 rounded-xl">
              <img 
                src="/analytics-preview.png" 
                alt="Analytics Dashboard"
                className="rounded-lg shadow-lg w-full"
              />
              <h3 className="text-xl font-semibold mt-4 mb-2">Track Your Growth</h3>
              <p className="text-luxury-neutral/60">Monitor your performance with detailed analytics and insights</p>
            </div>

            <div className="glass-morph p-6 rounded-xl">
              <img 
                src="/earnings-preview.png" 
                alt="Earnings Dashboard"
                className="rounded-lg shadow-lg w-full"
              />
              <h3 className="text-xl font-semibold mt-4 mb-2">Manage Your Earnings</h3>
              <p className="text-luxury-neutral/60">Track your revenue and manage your subscriptions easily</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PlatformPreview;
