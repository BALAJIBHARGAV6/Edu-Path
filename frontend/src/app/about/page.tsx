'use client'

import { motion } from 'framer-motion'
import { 
  Target, Users, Zap, Heart, Award, Code2, 
  BookOpen, Lightbulb, ArrowRight, CheckCircle2, Shield, Sparkles
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import PageWrapper from '@/components/PageWrapper'
import GradientText from '@/components/GradientText'
import Link from 'next/link'

const values = [
  { icon: Target, title: 'Mission-Driven', desc: 'Quality education for everyone' },
  { icon: Zap, title: 'AI-Powered', desc: 'Cutting-edge personalization' },
  { icon: Users, title: 'Community', desc: 'Learn together, grow together' },
  { icon: Shield, title: 'Privacy First', desc: 'Your data stays yours' }
]

export default function AboutPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  return (
    <PageWrapper>
      <div className="min-h-screen pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative py-20 px-6">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-10 rounded-full blur-[100px]" style={{ background: accent }} />
          </div>
          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" style={{ color: text }}>
                About <GradientText>EduPath AI</GradientText>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: muted }}>
                We're on a mission to make quality education accessible through AI-powered personalized learning.
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold neon-text">{stat.value}</div>
                <div className="text-[var(--text-tertiary)]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Our Story</h2>
              <div className="space-y-4 text-[var(--text-secondary)]">
                <p>
                  EduPath AI started when we noticed aspiring developers were overwhelmed by countless learning resources with no clear path to follow.
                </p>
                <p>
                  We asked: "What if AI could analyze your goals and create a personalized roadmap just for you?"
                </p>
                <p>
                  Today, we help thousands of learners achieve their career goals through AI-powered education.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-8 neon-border"
            >
              <Sparkles className="w-12 h-12 text-[var(--neon-500)] mb-4" />
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">AI-First Approach</h3>
              <p className="text-[var(--text-secondary)]">
                Our AI analyzes job market trends, your skills, and goals to create the most efficient learning path.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">Our Values</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--success-bg)] border border-[var(--neon-500)] flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-[var(--neon-500)]" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card p-10 text-center neon-border"
          >
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Ready to Start?</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Join thousands of learners on their journey to success.
            </p>
            <Link href="/auth/signup">
              <button className="btn-primary">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
      </div>
    </PageWrapper>
  )
}
