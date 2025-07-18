import { motion, useInView, AnimatePresence } from "framer-motion";
import { Users, Camera, Heart, DollarSign, Star, ArrowRight, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface UserPath {
  id: 'creator' | 'fan';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  benefits: string[];
  cta: string;
  gradient: string;
  features: string[];
}

const userPaths: UserPath[] = [
  {
    id: 'creator',
    title: "Become a Creator",
    subtitle: "Turn your passion into profit",
    icon: <Camera className="w-8 h-8" />,
    benefits: [
      "85% revenue share",
      "Instant payouts",
      "Advanced analytics",
      "24/7 support"
    ],
    cta: "Start Creating",
    gradient: "from-purple-600 to-pink-600",
    features: [
      "Upload unlimited content",
      "Set your own prices",
      "Build your fanbase",
      "Earn while you sleep"
    ]
  },
  {
    id: 'fan',
    title: "Join as a Fan",
    subtitle: "Connect with your favorite creators",
    icon: <Heart className="w-8 h-8" />,
    benefits: [
      "Exclusive content access",
      "Direct messaging",
      "Custom requests",
      "VIP perks"
    ],
    cta: "Explore Creators",
    gradient: "from-blue-600 to-purple-600",
    features: [
      "Discover new creators",
      "Support your favorites",
      "Get personalized content",
      "Join exclusive events"
    ]
  }
];

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'creator' | 'fan' | null;
}

const SignupModal = ({ isOpen, onClose, userType }: SignupModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  if (!userType) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="glass-card-heavy rounded-3xl p-8 border border-white/20">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {userType === 'creator' ? 'Become a Creator' : 'Join as a Fan'}
                  </h3>
                  <p className="text-gray-400 mt-1">Step {step} of 3</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${userPaths.find(p => p.id === userType)?.gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        placeholder="Choose a username"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        placeholder="Create a password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${userPaths.find(p => p.id === userType)?.gradient} flex items-center justify-center`}>
                        {userPaths.find(p => p.id === userType)?.icon}
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        {userType === 'creator' ? 'Creator Benefits' : 'Fan Benefits'}
                      </h4>
                      <ul className="space-y-2 text-gray-300">
                        {userPaths.find(p => p.id === userType)?.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-300">
                        I agree to the Terms of Service and Privacy Policy
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Buttons */}
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <Button
                    onClick={prevStep}
                    variant="outline"
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={step === 3 ? onClose : nextStep}
                  className={`flex-1 bg-gradient-to-r ${userPaths.find(p => p.id === userType)?.gradient} text-white hover:opacity-90`}
                  disabled={step === 3 && !formData.agreeToTerms}
                >
                  {step === 3 ? 'Create Account' : 'Continue'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const JoinFunnelSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedPath, setSelectedPath] = useState<'creator' | 'fan' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePathSelect = (pathId: 'creator' | 'fan') => {
    setSelectedPath(pathId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPath(null);
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      
      {/* Success Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              scale: 0,
              rotate: 0
            }}
            animate={{
              y: -100,
              scale: [0, 1, 0],
              rotate: 360,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeOut"
            }}
          >
            {['💫', '⭐', '✨', '🌟', '💎'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-display font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Choose Your Path
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Whether you're here to create or discover, we have the perfect experience waiting for you
          </p>
          
          {/* Quick Stats */}
          <motion.div
            className="flex justify-center gap-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div>
              <div className="text-3xl font-bold text-purple-400">50K+</div>
              <div className="text-gray-400 text-sm">Active Creators</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">2.1M+</div>
              <div className="text-gray-400 text-sm">Happy Fans</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">$4.2M+</div>
              <div className="text-gray-400 text-sm">Monthly Earnings</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Path Selection */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {userPaths.map((path, index) => (
            <motion.div
              key={path.id}
              className="relative glass-card-heavy rounded-3xl p-8 border-2 border-white/10 hover:border-purple-400/30 transition-all duration-500 cursor-pointer group"
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7 + index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => handlePathSelect(path.id)}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${path.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${path.gradient} mb-6`}>
                  {path.icon}
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-white mb-2">{path.title}</h3>
                <p className="text-gray-400 text-lg mb-8">{path.subtitle}</p>

                {/* Benefits Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {path.benefits.map((benefit, benefitIndex) => (
                    <motion.div
                      key={benefit}
                      className="flex items-center gap-2 text-gray-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 1 + index * 0.1 + benefitIndex * 0.05 }}
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${path.gradient}`} />
                      <span className="text-sm">{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {path.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature}
                      className="flex items-center gap-3 text-gray-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1.2 + index * 0.1 + featureIndex * 0.05 }}
                    >
                      <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  className={`w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r ${path.gradient} text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 group-hover:scale-105`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    {path.cta}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <p className="text-gray-400 text-lg mb-6">
            Join the fastest-growing creator economy platform
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <span>✓ Free to join</span>
            <span>✓ No monthly fees</span>
            <span>✓ Start earning immediately</span>
          </div>
        </motion.div>
      </div>

      {/* Signup Modal */}
      <SignupModal
        isOpen={isModalOpen}
        onClose={closeModal}
        userType={selectedPath}
      />
    </section>
  );
};