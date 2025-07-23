
import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, HelpCircle, MessageCircle, Book, Video, Users, DollarSign, Shield } from "lucide-react";

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: Users,
      title: "Getting Started",
      description: "New to EROXR? Start here",
      color: "text-blue-400"
    },
    {
      icon: DollarSign,
      title: "Earnings & Payments",
      description: "Payment questions and issues",
      color: "text-green-400"
    },
    {
      icon: Shield,
      title: "Safety & Security",
      description: "Keep your account secure",
      color: "text-red-400"
    },
    {
      icon: MessageCircle,
      title: "Technical Issues",
      description: "Platform bugs and problems",
      color: "text-purple-400"
    }
  ];

  const faqs = [
    {
      question: "How do I start earning on EROXR?",
      answer: "To start earning, simply create a creator account, verify your identity, and begin posting content. You can earn through subscriptions, tips, custom content, and live streams."
    },
    {
      question: "What is EROXR's fee structure?",
      answer: "EROXR takes only 7% of your earnings, which is the lowest in the industry. You keep 93% of all revenue from subscriptions, tips, and content sales."
    },
    {
      question: "How quickly do I receive payments?",
      answer: "EROXR offers instant payouts! Once you earn money, you can withdraw it immediately to your connected bank account or digital wallet."
    },
    {
      question: "Is my content safe and secure?",
      answer: "Yes, we use industry-leading security measures including end-to-end encryption, secure servers, and regular security audits to protect your content and data."
    },
    {
      question: "How do I verify my account?",
      answer: "Account verification requires a government-issued ID and age verification. This process typically takes 24-48 hours to complete."
    },
    {
      question: "Can I customize my profile and pricing?",
      answer: "Absolutely! You have full control over your profile, pricing, content tiers, and subscription options. Set your own rates and terms."
    },
    {
      question: "What types of content can I create?",
      answer: "You can create photos, videos, live streams, Eros Shorts, and custom content. All content must comply with our guidelines and be consensual."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach our support team through live chat, email at support@eroxr.se, or by submitting a ticket through your account dashboard."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <HelpCircle className="w-4 h-4 mr-2" />
            Help Center
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              How Can We Help?
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions, get help with your account, and learn how to make the most of EROXR.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="pl-12 py-6 text-lg bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400"
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
            >
              <Card className="text-center bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 transition-colors">
                <CardHeader>
                  <category.icon className={`w-8 h-8 ${category.color} mx-auto mb-2`} />
                  <CardTitle className="text-white text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm">{category.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <Accordion type="single" collapsible>
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-white hover:text-luxury-primary text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Support */}
        <motion.div 
          className="text-center bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 rounded-2xl p-12 backdrop-blur-sm border border-luxury-primary/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Our support team is here to help you succeed. Get in touch and we'll 
            respond as quickly as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Live Chat
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-luxury-primary/50 text-luxury-primary hover:bg-luxury-primary/10"
            >
              <Book className="w-5 h-5 mr-2" />
              Documentation
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Support;
