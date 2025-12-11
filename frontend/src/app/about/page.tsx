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
                We&apos;re on a mission to make quality education accessible through AI-powered personalized learning.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '50K+', label: 'Active Learners' },
                { value: '150+', label: 'Countries' },
                { value: '1000+', label: 'Learning Paths' },
                { value: '4.9', label: 'Avg Rating' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold" style={{ color: accent }}>{stat.value}</div>
                  <div style={{ color: muted }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6" style={{ color: text }}>Our Story</h2>
              <div className="space-y-4" style={{ color: muted }}>
                <p>
                  EduPath AI started when we noticed aspiring developers were overwhelmed by countless learning resources with no clear path to follow.
                </p>
                <p>
                  We asked: &quot;What if AI could analyze your goals and create a personalized roadmap just for you?&quot;
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
              className="p-8 rounded-2xl"
              style={{ 
                background: isDark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.05)',
                border: `1px solid ${isDark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.1)'}`
              }}
            >
              <Sparkles className="w-12 h-12 mb-4" style={{ color: accent }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: text }}>AI-First Approach</h3>
              <p style={{ color: muted }}>
                Our AI analyzes job market trends, your skills, and goals to create the most efficient learning path.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16" style={{ background: subtle }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold" style={{ color: text }}>Our Values</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 text-center rounded-2xl"
                style={{ 
                  background: bg,
                  border: `1px solid ${border}`
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ 
                    background: isDark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.05)',
                    border: `1px solid ${accent}`
                  }}
                >
                  <v.icon className="w-6 h-6" style={{ color: accent }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: text }}>{v.title}</h3>
                <p className="text-sm" style={{ color: muted }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-10 text-center rounded-2xl"
            style={{ 
              background: isDark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.05)',
              border: `1px solid ${isDark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.1)'}`
            }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: text }}>Ready to Start?</h2>
            <p className="mb-6" style={{ color: muted }}>
              Join thousands of learners on their journey to success.
            </p>
            <Link href="/auth/signup">
              <button 
                className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-all hover:scale-105"
                style={{ 
                  background: accent,
                  color: '#FFFFFF'
                }}
              >
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
