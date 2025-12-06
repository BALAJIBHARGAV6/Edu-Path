'use client'

import { motion } from 'framer-motion'

interface TextScrollProps {
  children: string
  baseVelocity?: number
  className?: string
}

export function TextScroll({ children, baseVelocity = 50, className = '' }: TextScrollProps) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div 
        className={`flex whitespace-nowrap ${className}`}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ 
          duration: baseVelocity, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
      >
        {[...Array(6)].map((_, i) => (
          <span key={i} className="shrink-0 px-4">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default TextScroll
