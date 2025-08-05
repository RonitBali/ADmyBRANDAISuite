"use client"

import type React from "react"

import { forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"

    const variants = {
      default:
        "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl",
      outline: "border border-white/20 text-white hover:bg-white/10 backdrop-blur-sm",
      ghost: "text-white hover:bg-white/10",
    }

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </motion.button>
    )
  },
)

Button.displayName = "Button"

export default Button
