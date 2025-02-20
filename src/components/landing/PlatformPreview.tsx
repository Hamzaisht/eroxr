
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
            <div className="glass-morph p-6 rounded-xl bg-[#161B22]/80 backdrop-blur-xl border border-white/10">
              <img 
                src="/lovable-uploads/3afb027b-f83e-477f-b9aa-ee70f156546f.png" 
                alt="Messages Interface"
                className="rounded-lg shadow-lg w-full"
              />
              <h3 className="text-xl font-semibold mt-4 mb-2">Connect Through Chat</h3>
              <p className="text-luxury-neutral/60">Build deeper connections with your audience through our advanced messaging system</p>
            </div>
            
            <div className="glass-morph p-6 rounded-xl bg-[#161B22]/80 backdrop-blur-xl border border-white/10">
              <img 
                src="/lovable-uploads/210f4161-ff9f-4874-8aad-93edd31b6e01.png" 
                alt="Live Streaming"
                className="rounded-lg shadow-lg w-full h-48 object-cover"
              />
              <h3 className="text-xl font-semibold mt-4 mb-2">Go Live With Your Community</h3>
              <p className="text-luxury-neutral/60">Stream live content and interact with your audience in real-time</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass-morph p-6 rounded-xl bg-[#161B22]/80 backdrop-blur-xl border border-white/10">
              <img 
                src="/lovable-uploads/680a4cbf-2252-4c48-9aab-c7385de5b32d.png" 
                alt="Business Development"
                className="rounded-lg shadow-lg w-full h-48 object-cover"
              />
              <h3 className="text-xl font-semibold mt-4 mb-2">Expand Your Network</h3>
              <p className="text-luxury-neutral/60">Connect with verified members and grow your business contacts</p>
            </div>

            <div className="glass-morph p-6 rounded-xl bg-[#161B22]/80 backdrop-blur-xl border border-white/10">
              <img 
                src="/analytics-preview.png" 
                alt="Analytics Dashboard"
                className="rounded-lg shadow-lg w-full h-48 object-cover"
              />
              <h3 className="text-xl font-semibold mt-4 mb-2">Track Your Growth</h3>
              <p className="text-luxury-neutral/60">Monitor your performance with detailed analytics and insights</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PlatformPreview;
