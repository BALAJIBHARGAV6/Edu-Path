'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Sparkles, Zap, Target, BookOpen, Minus } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useRef, useEffect, useState } from 'react'

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = target / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export default function HomePage() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  const testimonials = [
    { quote: "EduPath transformed my career. The AI roadmap was exactly what I needed.", name: "Alex Rivera", role: "Software Engineer @ Meta", avatar: "AR" },
    { quote: "From zero coding to a full-time dev role in 8 months. Incredible.", name: "Priya Sharma", role: "Full Stack Developer @ Stripe", avatar: "PS" },
    { quote: "The structured approach helped me stay focused throughout my journey.", name: "Marcus Johnson", role: "Backend Engineer @ Netflix", avatar: "MJ" },
    { quote: "Best investment in my career. The practice problems are top-notch.", name: "Emma Wilson", role: "Frontend Developer @ Airbnb", avatar: "EW" },
  ]

  return (
    <main style={{ background: bg }}>
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center relative px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30"
            style={{ background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.2) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto w-full pt-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 mb-8">
            <Sparkles className="w-4 h-4" style={{ color: accent }} />
            <span className="text-sm font-medium" style={{ color: muted }}>AI-Powered Learning Platform</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] mb-8">
            <span style={{ color: text }}>Learn.</span><br />
            <span style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #EC4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Build. Grow.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-center text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: muted }}>
            AI creates your personalized roadmap. Master in-demand skills with structured paths and hands-on practice.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href={user ? '/dashboard' : '/auth/signup'}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white" style={{ background: accent }}>
                {user ? 'Go to Dashboard' : 'Start Free'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/roadmaps">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-full text-base font-semibold" style={{ color: text, border: '1px solid ' + border }}>
                Explore Paths
              </motion.button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { value: 50000, suffix: '+', label: 'Learners' },
              { value: 200, suffix: '+', label: 'Paths' },
              { value: 95, suffix: '%', label: 'Success' },
              { value: 4.9, suffix: '★', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: text }}>
                  {stat.value === 4.9 ? '4.9★' : <CountUp target={stat.value} suffix={stat.suffix} />}
                </div>
                <div className="text-sm font-medium" style={{ color: muted }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-8 border-y overflow-hidden" style={{ borderColor: border }}>
        <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="flex items-center gap-12 whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12">
              {['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile', 'AI/ML', 'Data Science', 'Cloud'].map((s) => (
                <span key={s} className="text-sm font-medium tracking-wide" style={{ color: muted }}>
                  {s} <span style={{ color: accent }}>●</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Bento Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: accent }}>
            Features
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-5xl font-light mb-16" style={{ color: text }}>
            Everything you need<br />to become <span className="font-semibold">job-ready</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'AI Roadmaps', desc: 'Personalized learning paths generated based on your goals and skill level', large: true },
              { title: 'Practice', desc: 'Hands-on coding challenges with instant feedback' },
              { title: 'Video Tutorials', desc: 'Curated content from top educators' },
              { title: 'Progress Tracking', desc: 'Visual analytics to monitor your journey' },
              { title: 'Study Notes', desc: 'AI-generated summaries and materials', large: true },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={'p-8 rounded-2xl ' + (item.large ? 'md:col-span-2 lg:col-span-1' : '')}
                style={{ background: subtle, border: '1px solid ' + border }}
              >
                <Minus className="w-8 h-8 mb-6" style={{ color: accent }} />
                <h3 className="text-xl font-semibold mb-3" style={{ color: text }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: muted }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6" style={{ background: subtle }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: accent }}>How It Works</p>
            <h2 className="text-3xl lg:text-4xl font-bold" style={{ color: text }}>Three Steps to Success</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Tell Us Your Goals', desc: 'Share your experience level and what you want to achieve' },
              { step: '02', title: 'Get Your Roadmap', desc: 'AI creates a personalized learning path just for you' },
              { step: '03', title: 'Start Learning', desc: 'Follow the path with curated resources and practice' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-8 rounded-2xl"
                style={{ background: bg, border: '1px solid ' + border }}
              >
                <div className="text-6xl font-bold mb-4" style={{ color: isDark ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.1)' }}>{item.step}</div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: text }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: muted }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Paths */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: accent }}>Paths</p>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ color: text }}>Popular Learning Paths</h2>
            </div>
            <Link href="/roadmaps" className="hidden md:flex items-center gap-2 text-sm font-semibold" style={{ color: accent }}>
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <div className="grid gap-4">
            {[
              { name: 'Frontend Development', learners: '45,000+', duration: '6 months' },
              { name: 'Backend Development', learners: '38,000+', duration: '5 months' },
              { name: 'Full Stack Engineering', learners: '52,000+', duration: '8 months' },
              { name: 'DevOps & Cloud', learners: '28,000+', duration: '4 months' },
            ].map((path, i) => (
              <motion.div key={path.name} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ x: 8 }} className="group flex items-center justify-between p-6 rounded-2xl cursor-pointer" style={{ background: subtle, border: '1px solid ' + border }}>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold" style={{ background: 'rgba(37,99,235,0.15)', color: accent }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1" style={{ color: text }}>{path.name}</h3>
                    <p className="text-sm" style={{ color: muted }}>{path.learners} learners • {path.duration}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accent }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6" style={{ background: subtle }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: accent }}>Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: text }}>Loved by developers</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl" style={{ background: bg, border: '1px solid ' + border }}>
                <p className="text-lg mb-6 leading-relaxed" style={{ color: text }}>"{item.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: accent }}>{item.avatar}</div>
                  <div>
                    <p className="font-semibold" style={{ color: text }}>{item.name}</p>
                    <p className="text-sm" style={{ color: muted }}>{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: text }}>Start learning today</h2>
            <p className="text-lg mb-10" style={{ color: muted }}>Create your free account and get your personalized roadmap in minutes.</p>
            <Link href="/auth/signup">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-2 px-10 py-5 rounded-full text-lg font-semibold text-white" style={{ background: accent }}>
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6" style={{ borderTop: '1px solid ' + border }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: accent }}>E</div>
                <span className="text-lg font-bold" style={{ color: text }}>EduPath</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: muted }}>
                AI-powered learning platform helping developers master tech skills and advance their careers.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Roadmaps', 'Practice', 'Resources', 'Videos'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
              { title: 'Legal', links: ['Privacy', 'Terms'] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold mb-4" style={{ color: text }}>{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}><a href="#" className="text-sm hover:underline" style={{ color: muted }}>{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: border }}>
            <p className="text-sm" style={{ color: muted }}>© 2025 EduPath. All rights reserved.</p>
            <p className="text-sm" style={{ color: muted }}>Built for developers, by developers.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
