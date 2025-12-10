'use client'

import { ReactNode } from 'react'
import { useTheme } from '@/context/ThemeContext'

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

export default function PageWrapper({ children, className = '' }: PageWrapperProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const bg = isDark ? '#09090B' : '#FFFFFF'

  return (
    <main 
      className={`min-h-screen ${className}`}
      style={{ background: bg }}
    >
      {children}
    </main>
  )
}
