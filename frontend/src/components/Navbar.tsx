'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Moon, LogOut, Settings, Menu, X, LayoutDashboard } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/lib/store'

export default function Navbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const { onboardingData } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const isDark = theme === 'dark'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { 
    setMobileOpen(false)
    setUserMenu(false) 
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  if (pathname?.startsWith('/auth') || pathname === '/onboarding') return null

  const links = [
    { href: '/roadmaps', label: 'Roadmaps' },
    { href: '/practice', label: 'Practice' },
    { href: '/resources', label: 'Resources' },
    { href: '/videos', label: 'Videos' },
  ]

  const accent = '#2563EB'

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ 
          background: scrolled 
            ? (isDark 
                ? 'linear-gradient(135deg, rgba(9, 9, 11, 0.8) 0%, rgba(24, 24, 27, 0.6) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.6) 100%)')
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}` : 'none',
          boxShadow: scrolled ? (isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)') : 'none'
        }}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo with highlighted Edu */}
          <Link href="/" className="text-xl font-semibold tracking-tight flex items-center">
            <span style={{ color: accent }}>Edu</span>
            <span style={{ color: isDark ? '#F5F5F4' : '#1C1917' }}>Path</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-[13px] font-medium tracking-wide uppercase transition-colors"
                style={{ 
                  color: pathname === link.href ? accent : (isDark ? '#A8A29E' : '#78716C'),
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-full transition-colors"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-500" />}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                  style={{ background: accent }}
                >
                  {onboardingData.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <>
                      <div className="fixed inset-0" onClick={() => setUserMenu(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-12 w-48 rounded-xl p-1.5 shadow-xl"
                        style={{ background: isDark ? '#1C1917' : '#fff', border: '1px solid ' + (isDark ? '#292524' : '#E7E5E4') }}
                      >
                        <Link href="/dashboard" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                          style={{ color: isDark ? '#F5F5F4' : '#1C1917' }}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link href="/settings" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                          style={{ color: isDark ? '#F5F5F4' : '#1C1917' }}
                        >
                          <Settings className="w-4 h-4" /> Settings
                        </Link>
                        <button onClick={() => { setUserMenu(false); signOut() }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth/signup"
                className="hidden sm:block px-4 py-2 rounded-full text-sm font-medium text-white"
                style={{ background: accent }}
              >
                Get Started
              </Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
              {mobileOpen ? <X className="w-5 h-5" style={{ color: isDark ? '#F5F5F4' : '#1C1917' }} /> : <Menu className="w-5 h-5" style={{ color: isDark ? '#F5F5F4' : '#1C1917' }} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Fullscreen Mobile Menu with Glassmorphism */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 backdrop-blur-3xl"
            style={{ 
              background: isDark 
                ? 'linear-gradient(135deg, rgba(9, 9, 11, 0.95) 0%, rgba(24, 24, 27, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            }}
          >
            <div className="flex flex-col h-full pt-20 px-6">
              {/* Navigation Links */}
              <div className="flex-1 flex flex-col justify-center space-y-8">
                {links.map((link, i) => (
                  <motion.div 
                    key={link.href} 
                    initial={{ x: -50, opacity: 0 }} 
                    animate={{ x: 0, opacity: 1 }} 
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link 
                      href={link.href} 
                      onClick={() => setMobileOpen(false)}
                      className="block text-4xl font-bold tracking-tight transition-colors"
                      style={{ 
                        color: pathname === link.href ? accent : (isDark ? '#F5F5F4' : '#1C1917'),
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Section */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.4 }}
                className="pb-8 space-y-6"
              >
                {!user && (
                  <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-2xl text-lg font-semibold text-white"
                      style={{ background: accent }}
                    >
                      Get Started Free
                    </motion.button>
                  </Link>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: isDark ? '#A8A29E' : '#78716C' }}>
                    Theme
                  </span>
                  <button 
                    onClick={toggleTheme} 
                    className="p-3 rounded-full"
                    style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                  >
                    {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-stone-500" />}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
