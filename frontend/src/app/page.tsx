'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Sparkles, Target, BookOpen, Users, TrendingUp, Award, Star, Play } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import CountUp from '@/components/CountUp'
import GradientText from '@/components/GradientText'
import TextScroll from '@/components/TextScroll'

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
    { quote: "EduPath's AI roadmap was a game-changer. I went from beginner to landing my dream job at Meta in just 8 months.", name: "Alex Rivera", role: "Software Engineer @ Meta", avatar: "AR" },
    { quote: "The personalized learning path and practice problems helped me master full-stack development efficiently.", name: "Priya Sharma", role: "Full Stack Developer @ Stripe", avatar: "PS" },
    { quote: "Best platform for structured learning. The AI recommendations were spot-on for my career goals.", name: "Marcus Johnson", role: "Backend Engineer @ Netflix", avatar: "MJ" },
    { quote: "From zero coding knowledge to a senior developer role. EduPath made the impossible possible.", name: "Emma Wilson", role: "Senior Developer @ Airbnb", avatar: "EW" },
  ]

  return (
    <main style={{ background: bg }}>
      {/* Hero Section - Split Layout */}
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(37,99,235,0.1) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ 
                background: 'rgba(37,99,235,0.1)',
                border: '1px solid rgba(37,99,235,0.2)'
              }}
            >
              <Sparkles className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-medium" style={{ color: muted }}>
                AI-Powered Learning
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6"
            >
              <span style={{ color: text }}>Master coding with</span>
              <br />
              <GradientText>AI-powered roadmaps</GradientText>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg leading-relaxed mb-8 max-w-lg"
              style={{ color: muted }}
            >
              Get personalized learning paths, practice with real projects, and land your dream tech job faster than ever.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link href={user ? "/dashboard" : "/auth/signup"}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold"
                  style={{ background: accent }}
                >
                  {user ? "Continue Learning" : "Start Free"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="/roadmaps">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
                  style={{ color: text, border: '1px solid ' + border }}
                >
                  <Play className="w-4 h-4" />
                  Watch Demo
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-6"
            >
              {[
                { value: 50000, suffix: '+', label: 'Learners' },
                { value: 200, suffix: '+', label: 'Paths' },
                { value: 95, suffix: '%', label: 'Success' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: text }}>
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-medium" style={{ color: muted }}>{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            {/* Main Card */}
            <div 
              className="relative p-8 rounded-2xl"
              style={{ 
                background: subtle, 
                border: '1px solid ' + border,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold" style={{ color: text }}>AI Roadmap Generator</span>
              </div>
              <p className="text-sm mb-4" style={{ color: muted }}>
                "I want to become a full-stack developer"
              </p>
              <div className="space-y-2">
                {['React Fundamentals', 'Node.js Backend', 'Database Design', 'Deployment'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ background: bg }}
                  >
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span className="text-sm" style={{ color: text }}>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 p-3 rounded-xl bg-green-500 text-white"
            >
              <Award className="w-5 h-5" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 p-3 rounded-xl bg-purple-500 text-white"
            >
              <Target className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Professional Marquee */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${isDark ? '#1E293B' : '#F1F5F9'} 0%, ${isDark ? '#0F172A' : '#E2E8F0'} 100%)` }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `linear-gradient(90deg, ${accent}20 1px, transparent 1px)`,
            backgroundSize: '100px 100%'
          }} />
        </div>
        
        <div className="relative py-12">
          <div className="marquee-wrapper">
            <div className="marquee-track">
              <div className="marquee-content">
                <span className="marquee-item">Frontend Development</span>
                <span className="marquee-item">Backend Engineering</span>
                <span className="marquee-item">Full Stack Development</span>
                <span className="marquee-item">DevOps & Cloud Computing</span>
                <span className="marquee-item">Mobile App Development</span>
                <span className="marquee-item">Artificial Intelligence</span>
                <span className="marquee-item">Machine Learning</span>
                <span className="marquee-item">Data Science & Analytics</span>
                <span className="marquee-item">Cybersecurity</span>
                <span className="marquee-item">Game Development</span>
                <span className="marquee-item">Web3 & Blockchain</span>
                <span className="marquee-item">UI/UX Design</span>
              </div>
              <div className="marquee-content" aria-hidden="true">
                <span className="marquee-item">Frontend Development</span>
                <span className="marquee-item">Backend Engineering</span>
                <span className="marquee-item">Full Stack Development</span>
                <span className="marquee-item">DevOps & Cloud Computing</span>
                <span className="marquee-item">Mobile App Development</span>
                <span className="marquee-item">Artificial Intelligence</span>
                <span className="marquee-item">Machine Learning</span>
                <span className="marquee-item">Data Science & Analytics</span>
                <span className="marquee-item">Cybersecurity</span>
                <span className="marquee-item">Game Development</span>
                <span className="marquee-item">Web3 & Blockchain</span>
                <span className="marquee-item">UI/UX Design</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Fade Edges */}
        <div className="absolute top-0 left-0 w-24 h-full z-10" style={{ 
          background: `linear-gradient(to right, ${isDark ? '#0F172A' : '#F1F5F9'}, transparent)` 
        }} />
        <div className="absolute top-0 right-0 w-24 h-full z-10" style={{ 
          background: `linear-gradient(to left, ${isDark ? '#0F172A' : '#F1F5F9'}, transparent)` 
        }} />

        <style jsx>{`
          .marquee-wrapper {
            overflow: hidden;
            position: relative;
          }
          
          .marquee-track {
            display: flex;
            width: fit-content;
            animation: scroll 40s linear infinite;
          }
          
          .marquee-content {
            display: flex;
            flex-shrink: 0;
            gap: 0;
          }
          
          .marquee-item {
            display: inline-flex;
            align-items: center;
            padding: 0.75rem 2rem;
            font-size: 1.125rem;
            font-weight: 600;
            letter-spacing: 0.025em;
            text-transform: uppercase;
            color: ${muted};
            position: relative;
            transition: all 0.3s ease;
          }
          
          .marquee-item::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 4px;
            background: ${accent};
            border-radius: 50%;
            opacity: 0.6;
          }
          
          .marquee-item:hover {
            color: ${accent};
            transform: translateY(-2px);
          }
          
          .marquee-track:hover {
            animation-play-state: paused;
          }
          
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .marquee-track {
              animation-duration: 80s;
            }
          }
        `}</style>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: text }}>
              Everything you need to <GradientText>succeed</GradientText>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: muted }}>
              From AI-powered roadmaps to hands-on practice, we've built the complete learning ecosystem.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'AI Roadmaps', desc: 'Personalized learning paths based on your goals and experience level.' },
              { icon: Target, title: 'Practice Projects', desc: 'Real coding challenges with instant feedback and detailed explanations.' },
              { icon: BookOpen, title: 'Curated Resources', desc: 'Hand-picked tutorials and guides from top educators.' },
              { icon: TrendingUp, title: 'Progress Tracking', desc: 'Visual insights into your learning journey and achievements.' },
              { icon: Users, title: 'Community', desc: 'Connect with fellow learners and get help when you need it.' },
              { icon: Award, title: 'Certificates', desc: 'Earn industry-recognized certificates upon completion.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl group hover:scale-105 transition-transform"
                style={{ background: subtle, border: '1px solid ' + border }}
              >
                <item.icon className="w-8 h-8 mb-4 text-blue-500 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2" style={{ color: text }}>{item.title}</h3>
                <p className="text-sm" style={{ color: muted }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 px-6" style={{ background: subtle }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: accent }}>
                Learning Paths
              </p>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ color: text }}>
                Popular <GradientText>career paths</GradientText>
              </h2>
            </div>
            <Link href="/roadmaps" className="hidden md:flex items-center gap-2 text-sm font-semibold" style={{ color: accent }}>
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid gap-4">
            {[
              { name: 'Frontend Development', learners: '45,000+', duration: '6 months', description: 'Master React, Vue, and modern frontend technologies' },
              { name: 'Backend Development', learners: '38,000+', duration: '5 months', description: 'Build scalable APIs with Node.js, Python, and databases' },
              { name: 'Full Stack Engineering', learners: '52,000+', duration: '8 months', description: 'Complete web development from frontend to backend' },
              { name: 'DevOps & Cloud', learners: '28,000+', duration: '4 months', description: 'Deploy and scale applications with AWS, Docker, and Kubernetes' },
            ].map((path, i) => (
              <motion.div
                key={path.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 8 }}
                className="group flex items-center justify-between p-6 rounded-2xl cursor-pointer"
                style={{ background: bg, border: '1px solid ' + border }}
              >
                <div className="flex items-center gap-5">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white"
                    style={{ background: accent }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1" style={{ color: text }}>{path.name}</h3>
                    <p className="text-sm mb-1" style={{ color: muted }}>{path.description}</p>
                    <p className="text-xs font-medium" style={{ color: accent }}>
                      {path.learners} learners • {path.duration}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accent }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: accent }}>
              Success Stories
            </p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: text }}>
              Loved by <GradientText>developers</GradientText>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl"
                style={{ background: subtle, border: '1px solid ' + border }}
              >
                <div className="flex mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-base leading-relaxed mb-4" style={{ color: text }}>
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: accent }}
                  >
                    {item.avatar}
                  </div>
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
      <section className="py-20 px-6" style={{ background: subtle }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: text }}>
              Ready to <GradientText>start learning</GradientText>?
            </h2>
            <p className="text-lg mb-8" style={{ color: muted }}>
              Join thousands of developers who've accelerated their careers with AI-powered learning.
            </p>
            <Link href="/auth/signup">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white"
                style={{ background: accent }}
              >
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
