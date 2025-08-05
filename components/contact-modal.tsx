"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Phone, MessageSquare, Send, AlertCircle, CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useContactModal } from "@/hooks/use-contact-modal"
import Button from "@/components/ui/button"
import Card from "@/components/ui/card"

// Form validation schema
const contactFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email must be at least 5 characters")
    .max(100, "Email must be less than 100 characters"),
  company: z.string()
    .max(100, "Company name must be less than 100 characters")
    .optional(),
  phone: z.string()
    .refine((val) => {
      if (!val || val === "") return true; // Optional field
      // Allow various phone formats: +1234567890, (123) 456-7890, 123-456-7890, 123.456.7890, etc.
      const phoneRegex = /^[\+]?[(]?[\d\s\-\.\(\)]{10,17}$/;
      return phoneRegex.test(val.replace(/\s/g, ''));
    }, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  inquiryType: z.enum(["general", "demo", "pricing", "support", "partnership"]),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  consent: z.boolean()
    .refine(value => value === true, "You must agree to the privacy policy")
})

type ContactFormData = z.infer<typeof contactFormSchema>

export default function ContactModal() {
  const contactModal = useContactModal()
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')
  const scrollPositionRef = useRef<number>(0)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (contactModal.isOpen) {
      // Save current scroll position in ref for reliable access
      scrollPositionRef.current = window.scrollY
      
      // Get the current page width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      
      // Add class to body for CSS control
      document.body.classList.add('modal-open')
      
      // Use overflow hidden method instead of position fixed
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.documentElement.style.overflow = 'hidden'

      return () => {
        // Remove class from body
        document.body.classList.remove('modal-open')
        
        // Restore all styles
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
        document.documentElement.style.overflow = ''
        
        // No need to restore scroll position since we didn't change it
      }
    }
  }, [contactModal.isOpen])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      inquiryType: "general",
      consent: false
    }
  })

  // Handle keyboard events and prevent scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && contactModal.isOpen && !isSubmitting) {
        handleClose()
      }
    }

    const preventScroll = (e: WheelEvent) => {
      // Allow scroll only within modal
      const target = e.target as Element
      const modalElement = document.querySelector('.modal-scroll')
      
      if (modalElement && (modalElement.contains(target) || modalElement === target)) {
        return // Allow scroll within modal
      }
      
      e.preventDefault()
    }

    if (contactModal.isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('wheel', preventScroll, { passive: false })
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('wheel', preventScroll)
      }
    }
  }, [contactModal.isOpen, isSubmitting])

  const watchedFields = watch()

  const handleClose = () => {
    if (!isSubmitting && submitStatus !== 'success') {
      reset()
      setSubmitStatus('idle')
      setSubmitMessage('')
      contactModal.onClose()
      
      // No manual scroll restoration needed since we don't change position
    }
  }

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmitStatus('idle')
      
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure for demo
          if (Math.random() > 0.1) { // 90% success rate
            resolve(data)
          } else {
            reject(new Error('Network error'))
          }
        }, 2000)
      })

      setSubmitStatus('success')
      setSubmitMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.')
      
      // Reset form after successful submission
      setTimeout(() => {
        reset()
        setSubmitStatus('idle')
        contactModal.onClose()
      }, 3000)

    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('Sorry, there was an error sending your message. Please try again or contact us directly.')
    }
  }

  // Prevent backdrop click when submitting
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      handleClose()
    }
  }

  return (
    <AnimatePresence>
      {contactModal.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ 
            touchAction: 'none',
            overscrollBehavior: 'none',
            userSelect: 'none'
          }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[90vh] mx-4 overflow-y-auto modal-scroll"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
              touchAction: 'pan-y',
              overscrollBehavior: 'contain'
            }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <Card className="bg-slate-900/95 backdrop-blur-md border-white/20 p-6 md:p-8">
            <style jsx global>{`
              .modal-scroll {
                scrollbar-width: thin;
                scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
              }
              
              .modal-scroll::-webkit-scrollbar {
                width: 8px;
              }
              
              .modal-scroll::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
              }
              
              .modal-scroll::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 4px;
              }
              
              .modal-scroll::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
              }
              
              /* Prevent body scroll when modal is open - improved method */
              body.modal-open {
                overflow: hidden !important;
                touch-action: none !important;
              }
              
              html:has(body.modal-open) {
                overflow: hidden !important;
              }
            `}</style>
              {/* Header */}
              <div className="flex items-start justify-between mb-6 md:mb-8">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Get in Touch</h2>
                  <p className="text-white/70 text-sm md:text-base">Ready to transform your marketing? Let's talk about your needs.</p>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className={`flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {[
                  { icon: Mail, label: "Email", value: "hello@admybrand.ai" },
                  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                  { icon: MessageSquare, label: "Live Chat", value: "Available 24/7" },
                ].map((contact, index) => (
                  <div key={index} className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <contact.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-white font-medium">{contact.label}</div>
                    <div className="text-white/70 text-sm">{contact.value}</div>
                  </div>
                ))}
              </div>

              {/* Success/Error Messages */}
              {submitStatus !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border mb-6 ${
                    submitStatus === 'success' 
                      ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {submitStatus === 'success' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="font-medium">
                      {submitStatus === 'success' ? 'Success!' : 'Error'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{submitMessage}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Full Name *</label>
                    <input
                      {...register("name")}
                      type="text"
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-colors ${
                        errors.name 
                          ? 'border-red-500/50 focus:ring-red-500/50' 
                          : 'border-white/20 focus:ring-purple-500'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.name.message}
                      </motion.p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Email Address *</label>
                    <input
                      {...register("email")}
                      type="email"
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-colors ${
                        errors.email 
                          ? 'border-red-500/50 focus:ring-red-500/50' 
                          : 'border-white/20 focus:ring-purple-500'
                      }`}
                      placeholder="john@company.com"
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Company</label>
                    <input
                      {...register("company")}
                      type="text"
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-colors ${
                        errors.company 
                          ? 'border-red-500/50 focus:ring-red-500/50' 
                          : 'border-white/20 focus:ring-purple-500'
                      }`}
                      placeholder="Your Company"
                    />
                    {errors.company && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.company.message}
                      </motion.p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Phone Number</label>
                    <input
                      {...register("phone")}
                      type="tel"
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 transition-colors ${
                        errors.phone 
                          ? 'border-red-500/50 focus:ring-red-500/50' 
                          : 'border-white/20 focus:ring-purple-500'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone.message}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Inquiry Type *</label>
                  <select
                    {...register("inquiryType")}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:ring-2 transition-colors appearance-none cursor-pointer ${
                      errors.inquiryType 
                        ? 'border-red-500/50 focus:ring-red-500/50' 
                        : 'border-white/20 focus:ring-purple-500'
                    }`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em'
                    }}
                  >
                    <option value="" className="bg-gray-900 text-white">Select an inquiry type</option>
                    <option value="general" className="bg-gray-900 text-white">General Inquiry</option>
                    <option value="demo" className="bg-gray-900 text-white">Request Demo</option>
                    <option value="pricing" className="bg-gray-900 text-white">Pricing Question</option>
                    <option value="support" className="bg-gray-900 text-white">Technical Support</option>
                    <option value="partnership" className="bg-gray-900 text-white">Partnership</option>
                  </select>
                  {errors.inquiryType && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.inquiryType.message}
                    </motion.p>
                  )}
                </div>                <div>
                  <label className="block text-white font-medium mb-2">Message *</label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 resize-none transition-colors ${
                      errors.message 
                        ? 'border-red-500/50 focus:ring-red-500/50' 
                        : 'border-white/20 focus:ring-purple-500'
                    }`}
                    placeholder="Tell us about your marketing goals and how we can help..."
                  />
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {errors.message.message}
                    </motion.p>
                  )}
                  <div className="text-right text-white/50 text-xs mt-1">
                    {watchedFields.message?.length || 0}/1000 characters
                  </div>
                </div>

                {/* Privacy Consent */}
                <div className="flex items-start gap-3">
                  <input
                    {...register("consent")}
                    type="checkbox"
                    id="consent"
                    className="w-4 h-4 mt-1 rounded border border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-2"
                  />
                  <label htmlFor="consent" className="text-white/80 text-sm">
                    I agree to the{" "}
                    <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                      Terms of Service
                    </a>
                    . ADmyBRAND may contact me regarding their products and services. *
                  </label>
                </div>
                {errors.consent && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.consent.message}
                  </motion.p>
                )}

                <Button 
                  type="submit" 
                  disabled={isSubmitting || submitStatus === 'success'} 
                  className="w-full group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : submitStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-white/60 text-sm text-center mt-6 space-y-2">
                <p>We'll get back to you within 24 hours. For urgent matters, please call us directly.</p>
                <p className="text-xs">
                  Your information is secure and will only be used to respond to your inquiry. 
                  We respect your privacy and never share your data with third parties.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
