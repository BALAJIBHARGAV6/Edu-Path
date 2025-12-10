'use client'

import { motion } from 'framer-motion'

interface DualMarqueeProps {
  topItems: string[]
  bottomItems: string[]
  speed?: number
  className?: string
}

export function DualMarquee({ topItems, bottomItems, speed = 50, className = '' }: DualMarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      {/* Top Row - Moving Right */}
      <div className="flex mb-4">
        <motion.div
          className="flex gap-8 shrink-0"
          animate={{ x: ['-100%', '0%'] }}
          transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              {topItems.map((item, j) => (
                <span key={j} className="text-sm font-medium whitespace-nowrap opacity-70">
                  {item} <span className="text-blue-500 mx-2">●</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Row - Moving Left */}
      <div className="flex">
        <motion.div
          className="flex gap-8 shrink-0"
          animate={{ x: ['0%', '-100%'] }}
          transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              {bottomItems.map((item, j) => (
                <span key={j} className="text-sm font-medium whitespace-nowrap opacity-70">
                  {item} <span className="text-purple-500 mx-2">●</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default DualMarquee
