"use client"

import { motion } from "framer-motion"
import { Brain, BarChart3, Users, Zap, Target, Shield, Sparkles, TrendingUp } from "lucide-react"
import Card from "@/components/ui/card"

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Content Generation",
      description:
        "Create compelling ad copy, social media posts, and marketing materials with our advanced AI engine.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics Dashboard",
      description: "Get real-time insights into campaign performance with comprehensive analytics and reporting.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Users,
      title: "Audience Segmentation",
      description: "Automatically segment your audience based on behavior, demographics, and engagement patterns.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Automated Campaign Optimization",
      description: "Let AI continuously optimize your campaigns for maximum ROI and performance.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description: "Reach the right audience at the right time with AI-driven targeting algorithms.",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: Shield,
      title: "Brand Safety & Compliance",
      description: "Ensure your campaigns meet all regulatory requirements and maintain brand integrity.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Sparkles,
      title: "Creative Asset Generation",
      description: "Generate stunning visuals, videos, and creative assets tailored to your brand.",
      gradient: "from-teal-500 to-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Predictive Performance",
      description: "Forecast campaign performance and optimize budgets before launching.",
      gradient: "from-violet-500 to-purple-500",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
      filter: "blur(12px)",
      rotateX: 15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4 sm:px-0">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Modern Marketing
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto px-4 sm:px-0">
            Everything you need to create, optimize, and scale your marketing campaigns with the power of AI
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:scale-105 hover:shadow-2xl transition-all duration-250 group perspective-1000">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-250`}
                >
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
