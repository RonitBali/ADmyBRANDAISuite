"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const initLenis = async () => {
      const Lenis = (await import("lenis")).default

      const lenis = new Lenis({
        duration: isMobile ? 0.8 : 1.2, // Faster on mobile
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })

      lenisRef.current = lenis

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    }

    initLenis()

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
    }
  }, [isMobile])

  return <>{children}</>
}
