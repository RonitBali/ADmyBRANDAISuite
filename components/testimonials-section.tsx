"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import Card from "@/components/ui/card"
import Button from "@/components/ui/button"

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechFlow Inc.",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      content:
        "ADmyBRAND AI Suite transformed our marketing strategy completely. We saw a 300% increase in engagement and 150% boost in conversions within the first month.",
      metrics: { engagement: "+300%", conversions: "+150%", roi: "+250%" },
    },
    {
      name: "Michael Chen",
      role: "CEO",
      company: "StartupX",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      content:
        "The AI-powered content generation is incredible. What used to take our team days now takes minutes, and the quality is consistently outstanding.",
      metrics: { timesSaved: "90%", quality: "+200%", productivity: "+400%" },
    },
    {
      name: "Emily Rodriguez",
      role: "Growth Manager",
      company: "ScaleUp Co.",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      content:
        "The predictive analytics helped us optimize our ad spend and target the right audiences. Our ROAS improved by 180% in just two quarters.",
      metrics: { roas: "+180%", cpa: "-45%", reach: "+220%" },
    },
    {
      name: "David Park",
      role: "Digital Marketing Lead",
      company: "InnovateCorp",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      content:
        "The automation features are game-changing. We can now run complex multi-channel campaigns with minimal manual intervention.",
      metrics: { automation: "95%", efficiency: "+300%", campaigns: "+500%" },
    },
    {
      name: "Lisa Thompson",
      role: "Brand Manager",
      company: "GlobalBrand Ltd.",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      content:
        "Brand safety and compliance features give us peace of mind. We can scale our campaigns globally while maintaining brand integrity.",
      metrics: { compliance: "100%", globalReach: "+400%", brandSafety: "99.9%" },
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
    }, isMobile ? 8000 : 6000) // Longer intervals on mobile

    return () => clearInterval(timer)
  }, [testimonials.length, isMobile])

  // Optimized animations for mobile with proper sequencing
  const headerAnimation = {
    initial: { opacity: 0, y: isMobile ? 20 : 40, filter: isMobile ? "blur(0px)" : "blur(12px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: false, amount: isMobile ? 0.1 : 0.3 },
    transition: { 
      duration: isMobile ? 0.5 : 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: isMobile ? 0.1 : 0 
    }
  }

  const cardAnimation = shouldReduceMotion || isMobile ? {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  } : {
    initial: { opacity: 0, x: 100, filter: "blur(15px)", scale: 0.9 },
    animate: { opacity: 1, x: 0, filter: "blur(0px)", scale: 1 },
    exit: { opacity: 0, x: -100, filter: "blur(10px)", scale: 0.9 },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }

  const itemAnimation = (delay = 0) => shouldReduceMotion || isMobile ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { 
      duration: 0.4,
      delay: delay * (isMobile ? 0.1 : 0.15),
      ease: "easeOut"
    }
  } : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 0.5, 
      delay: delay * 0.15,
      ease: "easeOut"
    }
  }

  const nextTestimonial = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)
  }

  const prevTestimonial = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart(touch.clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    
    const touch = e.changedTouches[0]
    const touchEnd = touch.clientX
    const diff = touchStart - touchEnd
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextTestimonial()
      } else {
        prevTestimonial()
      }
    }
    setTouchStart(null)
  }

  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          {...headerAnimation}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4 sm:px-0">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Marketing Leaders
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto px-4 sm:px-0">
            See how companies are transforming their marketing with ADmyBRAND AI Suite
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: isMobile ? 0.98 : 0.95, filter: isMobile ? "blur(0px)" : "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: false, amount: isMobile ? 0.1 : 0.3 }}
          transition={{ 
            duration: isMobile ? 0.5 : 0.8, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: isMobile ? 0.2 : 0.1
          }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              {...cardAnimation}
              className="max-w-4xl mx-auto"
            >
              <Card 
                className="p-6 sm:p-8 lg:p-12 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="flex flex-col items-center gap-6 sm:gap-8">
                  {/* Testimonial Content */}
                  <div className="text-center w-full">
                    <motion.div
                      {...itemAnimation(0)}
                    >
                      <Quote className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 mb-4 sm:mb-6 mx-auto" />
                    </motion.div>

                    <motion.div
                      {...itemAnimation(1)}
                      className="flex items-center justify-center mb-4"
                    >
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                      ))}
                    </motion.div>

                    <motion.blockquote
                      {...itemAnimation(2)}
                      className="text-lg sm:text-xl lg:text-2xl text-white leading-relaxed mb-6 sm:mb-8 px-4 sm:px-0"
                    >
                      "{testimonials[currentIndex].content}"
                    </motion.blockquote>

                    <motion.div
                      {...itemAnimation(3)}
                      className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8"
                    >
                      <img
                        src={testimonials[currentIndex].image || "/placeholder.svg"}
                        alt={testimonials[currentIndex].name}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                      />
                      <div className="text-center sm:text-left">
                        <div className="text-white font-semibold text-base sm:text-lg">
                          {testimonials[currentIndex].name}
                        </div>
                        <div className="text-white/70 text-sm sm:text-base">{testimonials[currentIndex].role}</div>
                        <div className="text-purple-400 font-medium text-sm sm:text-base">
                          {testimonials[currentIndex].company}
                        </div>
                      </div>
                    </motion.div>

                    {/* Metrics */}
                    <motion.div
                      {...itemAnimation(4)}
                      className="grid grid-cols-3 gap-2 sm:gap-4"
                    >
                      {Object.entries(testimonials[currentIndex].metrics).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          {...itemAnimation(5 + index)}
                          className="text-center"
                        >
                          <div className="text-lg sm:text-2xl font-bold text-green-400">{value}</div>
                          <div className="text-white/60 text-xs sm:text-sm capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center mt-6 sm:mt-8 space-x-4"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={prevTestimonial}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:scale-110 transition-transform duration-300"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-purple-500 scale-125" : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextTestimonial}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:scale-110 transition-transform duration-300"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Company Logos */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <p className="text-white/60 mb-6 sm:mb-8 text-sm sm:text-base">Trusted by 500+ companies worldwide</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 items-center opacity-60">
            {["TechFlow", "StartupX", "ScaleUp", "InnovateCorp", "GlobalBrand"].map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-white/40 font-semibold text-sm sm:text-base lg:text-lg hover:text-white/60 transition-colors duration-300"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
