
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
                src="/lovable-uploads/e754d33f-d841-445d-bc8a-537e1694f818.png" 
                alt="Platform Interface"
                className="rounded-lg shadow-lg w-full"
              />
              <h3 className="text-xl font-semibold mt-4 mb-2">Create What You Want</h3>
              <p className="text-luxury-neutral/60">Build and customize your content with our powerful creation tools</p>
            </div>
            
            <div className="glass-morph p-6 rounded-xl bg-[#161B22]/80 backdrop-blur-xl border border-white/10">
              <img 
                src="/lovable-uploads/210f4161-ff9f-4874-8aad-93edd31b6e01.png" 
                alt="Community Features"
                className="rounded-lg shadow-lg w-full h-48 object-cover"
              />
              <h3 className="text-xl font-semibold mt-4 mb-2">Connect With Your Community</h3>
              <p className="text-luxury-neutral/60">Engage with your audience through our interactive features</p>
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
                alt="Content Management"
                className="rounded-lg shadow-lg w-full h-48 object-cover"
              />
              <h3 className="text-xl font-semibold mt-4 mb-2">Manage Your Content</h3>
              <p className="text-luxury-neutral/60">Organize and publish your content with ease</p>
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
