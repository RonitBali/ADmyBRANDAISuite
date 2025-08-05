"use client"

import Navigation from "@/components/navigation"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import PricingSection from "@/components/pricing-section"
import TestimonialsSection from "@/components/testimonials-section"
import FAQSection from "@/components/faq-section"
import Footer from "@/components/footer"
import ContactModal from "@/components/contact-modal"
import SmoothScrollProvider from "@/components/smooth-scroll-provider"

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden touch-manipulation">
        {/* Static background elements */}
        <div className="fixed inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-full blur-3xl" />
        </div>

        <Navigation />
        <main className="relative z-10">
          <HeroSection />
          <FeaturesSection />
          <PricingSection />
          <TestimonialsSection />
          <FAQSection />
        </main>
        <Footer />
        <ContactModal />
      </div>
    </SmoothScrollProvider>
  )
}
