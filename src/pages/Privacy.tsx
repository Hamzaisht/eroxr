
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, UserCheck, Globe } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      icon: Database,
      title: "Data Collection",
      content: [
        "Personal information (name, email, age verification)",
        "Payment information (processed securely)",
        "Content and usage data",
        "Device and browser information",
        "Communication records"
      ]
    },
    {
      icon: Shield,
      title: "Data Protection",
      content: [
        "End-to-end encryption for sensitive data",
        "Secure servers with 24/7 monitoring",
        "Regular security audits and updates",
        "GDPR and privacy law compliance",
        "Data breach notification procedures"
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights",
      content: [
        "Access your personal data",
        "Request data correction or deletion",
        "Data portability options",
        "Withdraw consent at any time",
        "Opt-out of marketing communications"
      ]
    },
    {
      icon: Eye,
      title: "Data Usage",
      content: [
        "Platform functionality and features",
        "Payment processing and earnings",
        "Content recommendations",
        "Safety and security measures",
        "Legal compliance requirements"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-luxury-primary to-luxury-accent">
            Privacy & Security
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your privacy is our priority. Learn how we collect, use, and protect your personal information.
          </p>
        </motion.div>

        {/* Last Updated */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-gray-400">Last updated: January 23, 2025</p>
        </motion.div>

        {/* Privacy Sections */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="h-full bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <section.icon className="w-6 h-6 text-luxury-primary" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-300 flex items-start gap-2">
                        <span className="w-2 h-2 bg-luxury-primary rounded-full flex-shrink-0 mt-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Privacy Policy */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center gap-3">
                <Lock className="w-6 h-6 text-luxury-primary" />
                Detailed Privacy Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Information We Collect</h3>
                <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes personal information like your name, email address, and payment information.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">How We Use Your Information</h3>
                <p>We use your information to provide, maintain, and improve our services, process payments, communicate with you, and ensure the security of our platform.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Information Sharing</h3>
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Data Security</h3>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Cookies and Tracking</h3>
                <p>We use cookies and similar tracking technologies to enhance your experience on our platform and analyze usage patterns.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Contact Us</h3>
                <p>If you have questions about this privacy policy, please contact us at privacy@eroxr.se</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
