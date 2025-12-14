'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Sparkles, Target, BookOpen, Users, TrendingUp, Award, Star, Play, ChevronRight, CheckCircle, Clock, Zap, Code, Database, Globe, Smartphone } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import CountUp from '@/components/CountUp'
import GradientText from '@/components/GradientText'
import TextScroll from '@/components/TextScroll'
import PageWrapper from '@/components/PageWrapper'

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
    <PageWrapper>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20 md:pt-24">
          <div className="absolute inset-0" style={{ background: isDark ? '#000000' : '#FFFFFF' }} />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.05)'} 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-20 lg:py-0">
            {/* Left Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
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
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6"
              >
                <span style={{ color: text }}>Master your Career with</span>
                <br />
                <GradientText>AI-powered roadmaps</GradientText>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
                style={{ color: muted }}
              >
                Get personalized learning paths, practice with real projects, and land your dream tech job faster than ever.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start"
              >
                <Link href={user ? "/dashboard" : "/auth/signup"}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold w-full sm:w-auto"
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
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold w-full sm:w-auto"
                    style={{ color: text, border: '1px solid ' + border }}
                  >
                    <Play className="w-4 h-4" />
                    Watch Demo
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Right Visual - Holographic Code Matrix */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative h-64 sm:h-80 lg:h-96 w-full max-w-lg mx-auto order-1 lg:order-2"
            >
              {/* 3D Container */}
              <div className="relative h-full w-full transform-gpu">
              
              {/* Holographic Grid */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Grid Lines */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`h-${i}`}
                    className="absolute w-full h-px"
                    style={{
                      top: `${i * 12.5}%`,
                      background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`,
                    }}
                    animate={{
                      opacity: [0.2, 0.8, 0.2],
                      scaleX: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`v-${i}`}
                    className="absolute h-full w-px"
                    style={{
                      left: `${i * 16.66}%`,
                      background: `linear-gradient(180deg, transparent, ${accent}30, transparent)`,
                    }}
                    animate={{
                      opacity: [0.1, 0.6, 0.1],
                      scaleY: [0.7, 1.1, 0.7],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>

              {/* Floating Code Blocks */}
              {[
                { code: 'const learn = () => {', x: '10%', y: '15%', delay: 1 },
                { code: '  return skills++', x: '60%', y: '25%', delay: 1.3 },
                { code: '}', x: '85%', y: '35%', delay: 1.6 },
                { code: 'async function build()', x: '20%', y: '50%', delay: 1.9 },
                { code: '{ await deploy() }', x: '70%', y: '60%', delay: 2.2 },
                { code: 'export success', x: '40%', y: '80%', delay: 2.5 },
              ].map((block, i) => (
                <motion.div
                  key={i}
                  className="absolute font-mono text-xs px-3 py-2 rounded-lg backdrop-blur-sm"
                  style={{
                    left: block.x,
                    top: block.y,
                    background: isDark 
                      ? 'rgba(37, 99, 235, 0.1)' 
                      : 'rgba(37, 99, 235, 0.05)',
                    border: `1px solid ${accent}30`,
                    color: accent,
                    boxShadow: `0 4px 20px ${accent}20`,
                  }}
                  initial={{ opacity: 0, y: 20, rotateX: -30 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    rotateX: 0,
                    z: [0, 20, 0],
                  }}
                  transition={{
                    delay: block.delay,
                    z: {
                      duration: 4 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotateY: 5,
                    boxShadow: `0 8px 30px ${accent}40`,
                  }}
                >
                  {block.code}
                </motion.div>
              ))}

              {/* Data Streams */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 rounded-full"
                  style={{
                    left: `${20 + i * 15}%`,
                    height: '100%',
                    background: `linear-gradient(180deg, transparent, ${accent}60, transparent)`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scaleY: [0.5, 1, 0.5],
                    y: [-50, 50, -50],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: "easeInOut"
                  }}
                />
              ))}

              {/* Binary Rain */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute font-mono text-xs"
                  style={{
                    left: `${Math.random() * 100}%`,
                    color: `${accent}60`,
                  }}
                  animate={{
                    y: [-20, 420],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "linear"
                  }}
                >
                  {Math.random() > 0.5 ? '1' : '0'}
                </motion.div>
              ))}


              {/* Scanning Lines */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(180deg, transparent 0%, ${accent}20 50%, transparent 100%)`,
                  height: '4px',
                }}
                animate={{
                  y: [0, 384, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Particle System */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: accent,
                    boxShadow: `0 0 8px ${accent}`,
                  }}
                  animate={{
                    x: [Math.random() * 400, Math.random() * 400],
                    y: [Math.random() * 400, Math.random() * 400],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5],
                  }}
                  transition={{
                    duration: 5 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut"
                  }}
                />
              ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Professional Marquee */}
      <section className="relative overflow-hidden">
        
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

      {/* Modern Footer */}
      <footer className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
              
              {/* Brand Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">EduPath</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                  Revolutionizing education with AI-powered personalized learning paths. 
                  Join over 50,000+ developers who've accelerated their careers with us.
                </p>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h4 className="text-white font-bold text-lg mb-6">Platform</h4>
                <ul className="space-y-4">
                  <li><Link href="/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors">Dashboard</Link></li>
                  <li><Link href="/roadmaps" className="text-gray-400 hover:text-blue-400 transition-colors">AI Roadmaps</Link></li>
                  <li><Link href="/practice" className="text-gray-400 hover:text-blue-400 transition-colors">Practice Hub</Link></li>
                  <li><Link href="/resources" className="text-gray-400 hover:text-blue-400 transition-colors">Resources</Link></li>
                  <li><Link href="/videos" className="text-gray-400 hover:text-blue-400 transition-colors">Video Library</Link></li>
                </ul>
              </motion.div>

              {/* Company */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h4 className="text-white font-bold text-lg mb-6">Company</h4>
                <ul className="space-y-4">
                  <li><Link href="/about" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Careers</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Help Center</Link></li>
                </ul>
              </motion.div>
            </div>

            {/* Bottom Section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
                <span>© 2025 EduPath AI. All rights reserved.</span>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center gap-4">
                  <Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
                  <Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Crafted with</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-red-500"
                >
                  ❤️
                </motion.span>
                <span>by developers, for developers</span>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>
      </div>
    </PageWrapper>
  )
}
