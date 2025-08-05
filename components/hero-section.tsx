"use client"

import { motion } from "framer-motion"
import { ArrowRight, Play, Sparkles, Zap, Target } from "lucide-react"
import Button from "@/components/ui/button"
import Card from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.1 : 0.2,
        delayChildren: isMobile ? 0.1 : 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 15 : 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 sm:space-y-8 py-8 sm:py-12"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm text-white/90">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Powered by Advanced AI Technology</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight px-4 sm:px-0">
              Transform Your Brand with{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI-Powered Marketing
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              ADmyBRAND AI Suite revolutionizes your marketing strategy with intelligent automation, personalized
              campaigns, and data-driven insights that drive real results.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0"
          >
            <Button size="lg" className="group w-full sm:w-auto">
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="ghost" size="lg" className="group w-full sm:w-auto">
              <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="pt-8 sm:pt-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-2xl mx-auto px-4 sm:px-0">
              {[
                { icon: Target, label: "500K+", desc: "Campaigns Optimized" },
                { icon: Zap, label: "10x", desc: "ROI Improvement" },
                { icon: Sparkles, label: "99.9%", desc: "Uptime Guarantee" },
              ].map((stat, index) => (
                <motion.div key={index} whileHover={{ scale: 1.05 }} className="text-center">
                  <Card className="p-4 sm:p-6 bg-white/5 backdrop-blur-sm border-white/10">
                    <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-xl sm:text-2xl font-bold text-white">{stat.label}</div>
                    <div className="text-white/60 text-xs sm:text-sm">{stat.desc}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image/Video Placeholder */}
          <motion.div variants={itemVariants} className="pt-8 sm:pt-12 px-4 sm:px-0">
            <Card className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" />
                  </div>
                  <p className="text-white/80 text-sm sm:text-base">Interactive Product Demo</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
