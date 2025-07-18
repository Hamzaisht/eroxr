import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Instagram, Twitter, MessageCircle, Users } from "lucide-react";

export const CinematicFooter = () => {
  const [ref, inView] = useInView({ threshold: 0.5 });

  const socialLinks = [
    { icon: Twitter, label: "Twitter", href: "#", color: "hover:text-blue-400" },
    { icon: Instagram, label: "Instagram", href: "#", color: "hover:text-pink-400" },
    { icon: MessageCircle, label: "Discord", href: "#", color: "hover:text-purple-400" },
    { icon: Users, label: "Reddit", href: "#", color: "hover:text-orange-400" }
  ];

  const legalLinks = [
    { label: "About", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Age Verification", href: "#" },
    { label: "Support", href: "#" },
    { label: "Press", href: "#" }
  ];

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8 }}
      className="relative py-20 bg-gradient-to-t from-black via-gray-950 to-black border-t border-white/10"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-pink-200 to-purple-300 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              EROXR
            </motion.h1>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto mt-4 rounded-full"
              animate={{
                width: ["96px", "48px", "96px"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white/70 mb-12 max-w-2xl mx-auto"
          >
            The future of adult content creation. Cinematic. Provocative. Yours.
          </motion.p>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center space-x-8 mb-12"
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                className={`text-white/60 ${social.color} transition-all duration-300 group`}
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <div className="relative">
                  <social.icon className="w-8 h-8" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 -z-10 blur-lg"
                    whileHover={{ scale: 1.5 }}
                  />
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8 mb-8"
          >
            {legalLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.05 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>

          {/* Language & Currency Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex justify-center gap-4 mb-8 text-sm"
          >
            <select className="bg-gray-800 border border-white/20 text-white rounded px-3 py-1 text-sm">
              <option>🇺🇸 English</option>
              <option>🇪🇸 Español</option>
              <option>🇫🇷 Français</option>
              <option>🇩🇪 Deutsch</option>
            </select>
            <select className="bg-gray-800 border border-white/20 text-white rounded px-3 py-1 text-sm">
              <option>💵 USD</option>
              <option>💶 EUR</option>
              <option>💷 GBP</option>
              <option>💴 JPY</option>
            </select>
          </motion.div>

          {/* Copyright & Warning */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="border-t border-white/10 pt-8 space-y-4"
          >
            <p className="text-white/40 text-sm">
              © 2024 EROXR. All rights reserved.
            </p>
            <p className="text-red-400 text-sm font-semibold">
              ⚠️ WARNING: This site contains adult content. You must be 18+ to access.
            </p>
            <p className="text-white/40 text-xs max-w-4xl mx-auto leading-relaxed">
              EROXR is committed to providing a safe, secure, and empowering platform for adult content creators and consumers. 
              All content is consensual and created by verified adults. We maintain zero tolerance for illegal content.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.footer>
  );
};