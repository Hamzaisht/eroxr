
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Users, DollarSign } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      icon: Users,
      title: "User Responsibilities",
      content: [
        "You must be 18+ to use EROXR",
        "All content must be original or properly licensed",
        "Respect other users and follow community guidelines",
        "Maintain accurate account information",
        "Report any violations or suspicious activity"
      ]
    },
    {
      icon: DollarSign,
      title: "Revenue & Payments",
      content: [
        "EROXR takes 7% of all transactions",
        "Creators keep 93% of their earnings",
        "Instant payouts available 24/7",
        "All payments processed securely",
        "Tax documentation provided as required"
      ]
    },
    {
      icon: Shield,
      title: "Content Guidelines",
      content: [
        "All content must be consensual and legal",
        "No underage content permitted",
        "No harassment or discrimination",
        "Respect intellectual property rights",
        "Content must comply with local laws"
      ]
    },
    {
      icon: FileText,
      title: "Platform Usage",
      content: [
        "Use platform for intended purposes only",
        "No automated systems without permission",
        "Respect platform security measures",
        "Follow all posted guidelines and policies",
        "Account termination for violations"
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
            Legal Information
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Terms of Service
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Please read these terms carefully before using EROXR. By accessing our platform, 
            you agree to be bound by these terms.
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

        {/* Terms Sections */}
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

        {/* Detailed Terms */}
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Detailed Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h3>
                <p>By accessing and using EROXR, you accept and agree to be bound by the terms and provision of this agreement.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">2. Age Verification</h3>
                <p>All users must be 18 years or older. We employ strict age verification processes to ensure compliance with applicable laws.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">3. Revenue Sharing</h3>
                <p>EROXR operates on a 7% platform fee model. Creators retain 93% of all earnings from subscriptions, tips, and content sales.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">4. Content Ownership</h3>
                <p>Creators retain full ownership of their content. EROXR has limited rights to display and distribute content on the platform.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">5. Prohibited Activities</h3>
                <p>Users are prohibited from engaging in harassment, illegal activities, copyright infringement, or any activity that violates our community guidelines.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">6. Termination</h3>
                <p>We reserve the right to terminate accounts that violate these terms. Users may also terminate their accounts at any time.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">7. Contact Information</h3>
                <p>For questions about these terms, please contact us at legal@eroxr.se</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
