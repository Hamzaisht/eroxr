import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Play, 
  MessageCircle,
  Heart,
  Share,
  BarChart3,
  Wallet
} from "lucide-react";

interface DemoStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  preview: React.ReactNode;
}

const demoSteps: DemoStep[] = [
  {
    id: "upload",
    title: "Upload Content",
    description: "Drag & drop your videos, photos, or start a livestream instantly",
    icon: <Upload className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    preview: (
      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
        <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 text-center">
          <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-blue-400 font-medium">Drop your content here</p>
          <p className="text-sm text-slate-400">Videos, photos, or start live</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-blue-500 hover:bg-blue-600">Upload File</Button>
          <Button size="sm" variant="outline">Go Live</Button>
        </div>
      </div>
    )
  },
  {
    id: "monetize",
    title: "Set Your Price",
    description: "Choose subscription tiers, PPV rates, and tip amounts",
    icon: <DollarSign className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    preview: (
      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
        <h4 className="text-white font-medium">Pricing Options</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center bg-slate-700 rounded p-2">
            <span className="text-sm">Monthly Subscription</span>
            <Badge className="bg-green-500">$19.99</Badge>
          </div>
          <div className="flex justify-between items-center bg-slate-700 rounded p-2">
            <span className="text-sm">PPV Content</span>
            <Badge className="bg-green-500">$4.99</Badge>
          </div>
          <div className="flex justify-between items-center bg-slate-700 rounded p-2">
            <span className="text-sm">Custom Tips</span>
            <Badge className="bg-green-500">$1-100</Badge>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "engage",
    title: "Connect with Fans",
    description: "Private messages, live chat, and exclusive community access",
    icon: <Users className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    preview: (
      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-400">Live Chat Active</span>
        </div>
        <div className="space-y-2">
          <div className="bg-slate-700 rounded p-2 text-sm">
            <span className="text-blue-400">@alex_fan:</span> Amazing content! 💖
          </div>
          <div className="bg-slate-700 rounded p-2 text-sm">
            <span className="text-green-400">@luna_supporter:</span> Can't wait for next stream!
          </div>
          <div className="bg-purple-500/20 rounded p-2 text-sm border border-purple-500/30">
            <span className="text-purple-400">You:</span> Thank you all! New content tomorrow 🔥
          </div>
        </div>
      </div>
    )
  },
  {
    id: "earn",
    title: "Track Earnings",
    description: "Real-time analytics, payout tracking, and growth insights",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500",
    preview: (
      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded p-3 text-center">
            <Wallet className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <p className="text-xs text-slate-400">This Month</p>
            <p className="text-lg font-bold text-green-400">$2,847</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded p-3 text-center">
            <BarChart3 className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <p className="text-xs text-slate-400">Growth</p>
            <p className="text-lg font-bold text-blue-400">+127%</p>
          </div>
        </div>
        <div className="h-16 bg-slate-700 rounded flex items-end justify-center gap-1 p-2">
          {[20, 35, 45, 30, 55, 70, 85].map((height, i) => (
            <div 
              key={i} 
              className="bg-gradient-to-t from-yellow-500 to-orange-500 w-3 rounded-t"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    )
  }
];

export const InteractiveDemo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % demoSteps.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <section className="py-20 px-4 relative bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              See How It Works
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            From upload to earnings in 4 simple steps. Experience the platform that's revolutionizing creator economy.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Step Navigation */}
          <div className="space-y-4">
            {demoSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`cursor-pointer p-6 rounded-2xl border transition-all duration-500 ${
                  activeStep === index
                    ? 'bg-gradient-to-r from-slate-800 to-slate-700 border-luxury-primary shadow-lg shadow-luxury-primary/20'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => {
                  setActiveStep(index);
                  setIsAutoPlaying(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${step.color} flex-shrink-0`}>
                    {step.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400">{step.description}</p>
                  </div>

                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    activeStep === index
                      ? 'border-luxury-primary bg-luxury-primary text-white'
                      : 'border-slate-600 text-slate-600'
                  }`}>
                    {activeStep === index ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                {activeStep === index && (
                  <motion.div
                    className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-luxury-primary to-luxury-accent"
                      initial={{ width: 0 }}
                      animate={{ width: isAutoPlaying ? "100%" : "0%" }}
                      transition={{ duration: 4, ease: "linear" }}
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Preview Panel */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-luxury-primary/20 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${demoSteps[activeStep].color}`}>
                      {demoSteps[activeStep].icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{demoSteps[activeStep].title}</h3>
                      <p className="text-slate-400">{demoSteps[activeStep].description}</p>
                    </div>
                  </div>
                  
                  {demoSteps[activeStep].preview}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating action indicators */}
            <motion.div
              className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full p-3"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <DollarSign className="w-5 h-5" />
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-blue-500 text-white rounded-full p-3"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <Users className="w-5 h-5" />
            </motion.div>
          </div>
        </div>

        {/* Auto-play control */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="border-luxury-primary/30 hover:bg-luxury-primary/10"
          >
            {isAutoPlaying ? "Pause Auto-Play" : "Resume Auto-Play"}
          </Button>
        </div>
      </div>
    </section>
  );
};