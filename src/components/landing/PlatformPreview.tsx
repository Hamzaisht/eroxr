
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import PlatformFeatureAdmin from "./PlatformFeatureAdmin";

interface PlatformFeature {
  id: string;
  feature_name: string;
  image_path: string;
  display_order: number;
  title: string;
  description: string;
}

const PlatformPreview = () => {
  const session = useSession();
  const isAdmin = session?.user?.email === 'hamzaishtiaq242@gmail.com';

  const { data: features } = useQuery({
    queryKey: ['platform-features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_features')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as PlatformFeature[];
    }
  });

  const leftFeatures = features?.slice(0, 2) || [];
  const rightFeatures = features?.slice(2, 4) || [];

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
            {leftFeatures.map((feature) => (
              <div key={feature.id} className="glass-morph p-6 rounded-xl bg-[#161B22]/80 backdrop-blur-xl border border-white/10">
                {feature.image_path ? (
                  <img 
                    src={`${supabase.storage.from('platform-features').getPublicUrl(feature.image_path).data.publicUrl}`}
                    alt={feature.title}
                    className="rounded-lg shadow-lg w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-luxury-darker rounded-lg flex items-center justify-center text-luxury-neutral/40">
                    Upload feature screenshot
                  </div>
                )}
                <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                <p className="text-luxury-neutral/60">{feature.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {rightFeatures.map((feature) => (
              <div key={feature.id} className="glass-morph p-6 rounded-xl bg-[#161B22]/80 backdrop-blur-xl border border-white/10">
                {feature.image_path ? (
                  <img 
                    src={`${supabase.storage.from('platform-features').getPublicUrl(feature.image_path).data.publicUrl}`}
                    alt={feature.title}
                    className="rounded-lg shadow-lg w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-luxury-darker rounded-lg flex items-center justify-center text-luxury-neutral/40">
                    Upload feature screenshot
                  </div>
                )}
                <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                <p className="text-luxury-neutral/60">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      {isAdmin && <PlatformFeatureAdmin />}
    </section>
  );
};

export default PlatformPreview;
