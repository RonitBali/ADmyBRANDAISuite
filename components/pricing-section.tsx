"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Zap, Crown, Rocket } from "lucide-react"
import Button from "@/components/ui/button"
import Card from "@/components/ui/card"

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Starter",
      icon: Zap,
      description: "Perfect for small businesses getting started",
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        "Up to 5 campaigns",
        "Basic AI content generation",
        "Standard analytics",
        "Email support",
        "1 user account",
        "Basic templates",
      ],
      gradient: "from-blue-500 to-cyan-500",
      popular: false,
    },
    {
      name: "Professional",
      icon: Crown,
      description: "Ideal for growing marketing teams",
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        "Unlimited campaigns",
        "Advanced AI features",
        "Real-time analytics",
        "Priority support",
        "5 user accounts",
        "Custom templates",
        "A/B testing",
        "API access",
      ],
      gradient: "from-purple-500 to-pink-500",
      popular: true,
    },
    {
      name: "Enterprise",
      icon: Rocket,
      description: "For large organizations with custom needs",
      monthlyPrice: 299,
      annualPrice: 2990,
      features: [
        "Everything in Professional",
        "Custom AI model training",
        "Advanced integrations",
        "Dedicated account manager",
        "Unlimited users",
        "White-label options",
        "SLA guarantee",
        "Custom reporting",
      ],
      gradient: "from-orange-500 to-red-500",
      popular: false,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 80,
      scale: 0.85,
      filter: "blur(15px)",
      rotateY: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      rotateY: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  }

  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4 sm:px-0">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0">
            Start free and scale as you grow. All plans include our core AI features.
          </p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center space-x-4 mb-8 sm:mb-12"
          >
            <span className={`text-sm transition-colors duration-300 ${!isAnnual ? "text-white" : "text-white/60"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all duration-300 ${
                isAnnual ? "bg-gradient-to-r from-blue-500 to-purple-600" : "bg-white/20"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 sm:w-5 sm:h-5 bg-white rounded-full transition-all duration-300 ${
                  isAnnual ? "translate-x-6 sm:translate-x-8" : "translate-x-0.5 sm:translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm transition-colors duration-300 ${isAnnual ? "text-white" : "text-white/60"}`}>
              Annual
            </span>
            {isAnnual && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full"
              >
                Save 20%
              </motion.span>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card
                className={`relative h-full p-6 sm:p-8 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-500 group ${
                  plan.popular ? "ring-2 ring-purple-500/50 lg:scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 sm:px-4 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                      Most Popular
                    </div>
                  </motion.div>
                )}

                <div className="text-center mb-6 sm:mb-8">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                  >
                    <plan.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">{plan.description}</p>

                  <motion.div
                    key={isAnnual ? "annual" : "monthly"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 sm:mb-6"
                  >
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-white/60 text-sm sm:text-base">/{isAnnual ? "year" : "month"}</span>
                  </motion.div>

                  <Button
                    className={`w-full transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                  </Button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.4, delay: featureIndex * 0.05 }}
                      className="flex items-center space-x-3"
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white/80 text-sm sm:text-base">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <Card className="max-w-2xl mx-auto p-6 sm:p-8 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-250">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Need a Custom Solution?</h3>
            <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">
              Contact our sales team for enterprise pricing and custom features tailored to your organization.
            </p>
            <Button variant="outline" className="hover:scale-105 transition-transform duration-300 bg-transparent">
              Schedule a Demo
            </Button>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
