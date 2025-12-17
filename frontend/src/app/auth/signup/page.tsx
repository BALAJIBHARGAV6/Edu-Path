'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Loader2, ArrowRight, Sparkles, Github, Chrome } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success('Account created successfully! Welcome to EduPath.')
    // Redirect new users directly to onboarding
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen flex" style={{ background: bg }}>
      {/* Left Side - Branding */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ 
          background: isDark 
            ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)'
            : 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)'
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">EduPath AI</span>
          </Link>
        </div>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-6 leading-tight"
          >
            Start your journey to<br />becoming a better developer
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-lg"
          >
            Join thousands accelerating their careers with AI-powered learning.
          </motion.p>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-sm">© 2024 EduPath AI</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: accent }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold" style={{ color: text }}>EduPath AI</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: text }}>Create your account</h1>
            <p style={{ color: muted }}>Start your personalized learning journey today</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all hover:scale-[1.02]" style={{ background: subtle, color: text, border: `1px solid ${border}` }}>
              <Github className="w-5 h-5" />GitHub
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all hover:scale-[1.02]" style={{ background: subtle, color: text, border: `1px solid ${border}` }}>
              <Chrome className="w-5 h-5" />Google
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: border }} />
            <span className="text-sm" style={{ color: muted }}>or email</span>
            <div className="flex-1 h-px" style={{ background: border }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: text }}>Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: muted }} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  style={{ background: subtle, color: text, border: `1px solid ${border}` }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: text }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: muted }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  style={{ background: subtle, color: text, border: `1px solid ${border}` }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: text }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: muted }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  style={{ background: subtle, color: text, border: `1px solid ${border}` }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
              style={{ background: accent, boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)' }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p style={{ color: muted }}>Already have an account? <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: accent }}>Sign in</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
