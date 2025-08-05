"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import Card from "@/components/ui/card"
import { useContactModal } from "@/hooks/use-contact-modal"

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const contactModal = useContactModal()

  const faqs = [
    {
      question: "How does ADmyBRAND AI Suite work?",
      answer:
        "Our AI Suite uses advanced machine learning algorithms to analyze your brand, target audience, and market trends. It then generates personalized marketing content, optimizes campaigns in real-time, and provides actionable insights to improve your marketing performance.",
    },
    {
      question: "What types of content can the AI generate?",
      answer:
        "Our AI can generate a wide variety of marketing content including ad copy, social media posts, email campaigns, blog articles, product descriptions, video scripts, and visual assets. All content is tailored to your brand voice and target audience.",
    },
    {
      question: "How quickly can I see results?",
      answer:
        "Most customers see initial improvements within the first week of implementation. Significant results, including increased engagement and conversions, typically become apparent within 2-4 weeks as the AI learns and optimizes your campaigns.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Absolutely. We use enterprise-grade security measures including end-to-end encryption, SOC 2 compliance, and GDPR compliance. Your data is never shared with third parties and you maintain full ownership of all your content and insights.",
    },
    {
      question: "Can I integrate with my existing marketing tools?",
      answer:
        "Yes! ADmyBRAND AI Suite integrates with over 100+ popular marketing tools including Google Ads, Facebook Ads, HubSpot, Salesforce, Mailchimp, and many more. Our API also allows for custom integrations.",
    },
    {
      question: "Do I need technical expertise to use the platform?",
      answer:
        "Not at all! Our platform is designed to be user-friendly for marketers of all technical levels. We provide comprehensive onboarding, training resources, and 24/7 support to ensure you get the most out of our AI Suite.",
    },
    {
      question: "What if I need to cancel my subscription?",
      answer:
        "You can cancel your subscription at any time with no cancellation fees. We offer a 30-day money-back guarantee, and you can export all your data before canceling. We also provide migration assistance if needed.",
    },
    {
      question: "How does pricing work for team accounts?",
      answer:
        "Our pricing is based on the number of active users and campaigns. Team accounts include collaboration features, role-based permissions, and shared workspaces. Contact our sales team for custom enterprise pricing for larger organizations.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4 sm:px-0">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 px-4 sm:px-0">
            Everything you need to know about ADmyBRAND AI Suite
          </p>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.3, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]">
                <motion.button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-300"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-base sm:text-lg font-semibold text-white pr-4">{faq.question}</h3>
                  <motion.div
                    className="flex-shrink-0"
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {openIndex === index ? (
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    ) : (
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    )}
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, filter: "blur(5px)" }}
                      animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                      exit={{ height: 0, opacity: 0, filter: "blur(5px)" }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <p className="text-white/80 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 sm:mt-12 text-center"
        >
          <Card className="p-6 sm:p-8 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-500">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Still have questions?</h3>
            <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">
              Our support team is here to help you get the most out of ADmyBRAND AI Suite.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => contactModal.onOpen()}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base"
              >
                Contact Support
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 sm:px-6 sm:py-3 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
              >
                Schedule Demo
              </motion.button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
