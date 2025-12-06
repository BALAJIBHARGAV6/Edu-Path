'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  User, Target, Sparkles, Clock, ArrowRight, ArrowLeft, CheckCircle2, Loader2,
  Code, Database, Cloud, Smartphone, Brain, BarChart, Shield, Palette, Rocket
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useStore } from '@/lib/store'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

const CAREER_GOALS = [
  { id: 'frontend', label: 'Frontend Developer', icon: Code },
  { id: 'backend', label: 'Backend Developer', icon: Database },
  { id: 'fullstack', label: 'Full Stack Developer', icon: Code },
  { id: 'mobile', label: 'Mobile Developer', icon: Smartphone },
  { id: 'devops', label: 'DevOps Engineer', icon: Cloud },
  { id: 'data', label: 'Data Scientist', icon: BarChart },
  { id: 'ml', label: 'ML Engineer', icon: Brain },
  { id: 'security', label: 'Security Engineer', icon: Shield },
  { id: 'uiux', label: 'UI/UX Designer', icon: Palette },
]

const SKILLS = {
  'Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'PHP'],
  'Frontend': ['React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'HTML/CSS', 'Tailwind'],
  'Backend': ['Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'FastAPI', 'GraphQL'],
  'Database': ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase', 'Supabase'],
  'DevOps': ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Linux'],
}

const EXPERIENCE = [
  { id: 'beginner', label: 'Beginner', desc: 'Less than 1 year', emoji: '🌱' },
  { id: 'intermediate', label: 'Intermediate', desc: '1-3 years', emoji: '🌿' },
  { id: 'advanced', label: 'Advanced', desc: '3+ years', emoji: '🌳' },
]

const LEARNING_STYLES = [
  { id: 'visual', label: 'Visual', desc: 'Videos & diagrams', emoji: '👁️' },
  { id: 'reading', label: 'Reading', desc: 'Articles & docs', emoji: '📚' },
  { id: 'hands-on', label: 'Hands-on', desc: 'Projects & code', emoji: '🛠️' },
  { id: 'mixed', label: 'Mixed', desc: 'All styles', emoji: '🎯' },
]

const steps = [
  { id: 1, title: 'Profile', icon: User },
  { id: 2, title: 'Skills', icon: Target },
  { id: 3, title: 'Experience', icon: Sparkles },
  { id: 4, title: 'Preferences', icon: Clock },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { 
    onboardingStep, setOnboardingStep, onboardingData, updateOnboardingData,
    setCurrentRoadmap, setLoading, isLoading
  } = useStore()
  
  const [selectedCategory, setSelectedCategory] = useState('Languages')

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  useEffect(() => {
    if (user?.email && !onboardingData.email) {
      updateOnboardingData({ email: user.email })
    }
  }, [user, onboardingData.email, updateOnboardingData])

  const nextStep = () => onboardingStep < 4 && setOnboardingStep(onboardingStep + 1)
  const prevStep = () => onboardingStep > 1 && setOnboardingStep(onboardingStep - 1)

  const toggleSkill = (skill: string) => {
    const skills = onboardingData.skills
    if (skills.includes(skill)) {
      updateOnboardingData({ skills: skills.filter((s: string) => s !== skill) })
    } else {
      updateOnboardingData({ skills: [...skills, skill] })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      })
      const data = await response.json()
      if (data.success) {
        setCurrentRoadmap(data.roadmap)
        toast.success('Your personalized roadmap is ready!')
        router.push('/dashboard')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error('Failed to generate roadmap. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (onboardingStep) {
      case 1: return onboardingData.fullName && onboardingData.email && onboardingData.careerGoal
      case 2: return onboardingData.skills.length >= 1
      case 3: return onboardingData.experienceLevel
      case 4: return onboardingData.learningStyle && onboardingData.hoursPerWeek > 0
      default: return false
    }
  }

  return (
    <div style={{ background: isDark ? '#000' : '#fff', minHeight: '100vh' }} className="flex">
      {/* Sidebar */}
      <div 
        className="hidden lg:flex w-72 flex-col p-6 border-r"
        style={{ 
          background: isDark ? '#0a0a0a' : '#f8f8f8',
          borderColor: isDark ? '#222' : '#eee'
        }}
      >
        <div className="flex items-center gap-3 mb-10">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-black"
            style={{ background: 'var(--neon)', boxShadow: 'var(--glow-sm)' }}
          >
            E
          </div>
          <span className="text-lg font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
            Edu<span style={{ color: 'var(--neon)' }}>Path</span>
          </span>
        </div>

        {/* Steps */}
        <div className="space-y-2 flex-1">
          {steps.map((step) => (
            <div 
              key={step.id}
              className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{ 
                background: onboardingStep === step.id ? 'rgba(0,247,113,0.1)' : 'transparent',
                borderLeft: onboardingStep === step.id ? '3px solid var(--neon)' : '3px solid transparent'
              }}
            >
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ 
                  background: onboardingStep > step.id ? 'var(--neon)' : 
                             onboardingStep === step.id ? 'rgba(0,247,113,0.2)' : 
                             (isDark ? '#1a1a1a' : '#eee'),
                  color: onboardingStep > step.id ? '#000' : 
                         onboardingStep === step.id ? 'var(--neon)' : 
                         (isDark ? '#666' : '#999')
                }}
              >
                {onboardingStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <div>
                <p 
                  className="font-medium text-sm"
                  style={{ color: onboardingStep === step.id ? 'var(--neon)' : (isDark ? '#888' : '#666') }}
                >
                  {step.title}
                </p>
                <p className="text-xs" style={{ color: isDark ? '#555' : '#999' }}>Step {step.id} of 4</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-2" style={{ color: isDark ? '#888' : '#666' }}>
            <span>Progress</span>
            <span style={{ color: 'var(--neon)' }}>{Math.round((onboardingStep / 4) * 100)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(onboardingStep / 4) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Profile */}
            {onboardingStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Rocket className="w-8 h-8" style={{ color: 'var(--neon)' }} />
                  <h2 className="text-3xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
                    Let's get started
                  </h2>
                </div>
                <p className="mb-8" style={{ color: isDark ? '#888' : '#666' }}>
                  Tell us about yourself and your career goals
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={onboardingData.fullName}
                      onChange={(e) => updateOnboardingData({ fullName: e.target.value })}
                      placeholder="Enter your name"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={onboardingData.email}
                      onChange={(e) => updateOnboardingData({ email: e.target.value })}
                      placeholder="Enter your email"
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-4" style={{ color: isDark ? '#fff' : '#000' }}>
                      Career Goal
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {CAREER_GOALS.map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => updateOnboardingData({ careerGoal: goal.label })}
                          className="p-4 rounded-xl border-2 transition-all text-left"
                          style={{ 
                            background: onboardingData.careerGoal === goal.label 
                              ? 'rgba(0,247,113,0.1)' 
                              : (isDark ? '#111' : '#f8f8f8'),
                            borderColor: onboardingData.careerGoal === goal.label 
                              ? 'var(--neon)' 
                              : (isDark ? '#222' : '#eee')
                          }}
                        >
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                            style={{ 
                              background: onboardingData.careerGoal === goal.label 
                                ? 'var(--neon)' 
                                : 'rgba(0,247,113,0.1)',
                              color: onboardingData.careerGoal === goal.label ? '#000' : 'var(--neon)'
                            }}
                          >
                            <goal.icon className="w-5 h-5" />
                          </div>
                          <p 
                            className="text-sm font-medium"
                            style={{ color: isDark ? '#fff' : '#000' }}
                          >
                            {goal.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Skills */}
            {onboardingStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-bold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
                  Your current skills
                </h2>
                <p className="mb-8" style={{ color: isDark ? '#888' : '#666' }}>
                  Select technologies you already know
                </p>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.keys(SKILLS).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                      style={{ 
                        background: selectedCategory === cat ? 'var(--neon)' : (isDark ? '#1a1a1a' : '#f0f0f0'),
                        color: selectedCategory === cat ? '#000' : (isDark ? '#888' : '#666')
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {SKILLS[selectedCategory as keyof typeof SKILLS].map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{ 
                        background: onboardingData.skills.includes(skill) 
                          ? 'var(--neon)' 
                          : (isDark ? '#1a1a1a' : '#f0f0f0'),
                        color: onboardingData.skills.includes(skill) ? '#000' : (isDark ? '#888' : '#666'),
                        border: onboardingData.skills.includes(skill) 
                          ? '1px solid var(--neon)' 
                          : `1px solid ${isDark ? '#333' : '#ddd'}`
                      }}
                    >
                      {skill}
                    </button>
                  ))}
                </div>

                {/* Selected */}
                {onboardingData.skills.length > 0 && (
                  <div 
                    className="p-4 rounded-xl border"
                    style={{ 
                      background: isDark ? '#0a0a0a' : '#f8f8f8',
                      borderColor: isDark ? '#222' : '#eee'
                    }}
                  >
                    <p className="text-sm mb-3" style={{ color: isDark ? '#888' : '#666' }}>
                      Selected ({onboardingData.skills.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {onboardingData.skills.map((skill: string) => (
                        <span
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className="badge cursor-pointer"
                        >
                          {skill} ×
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Experience */}
            {onboardingStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-bold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
                  Experience level
                </h2>
                <p className="mb-8" style={{ color: isDark ? '#888' : '#666' }}>
                  Where are you in your journey?
                </p>

                <div className="space-y-4">
                  {EXPERIENCE.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => updateOnboardingData({ experienceLevel: level.id as any })}
                      className="w-full p-5 rounded-xl border-2 transition-all text-left flex items-center gap-4"
                      style={{ 
                        background: onboardingData.experienceLevel === level.id 
                          ? 'rgba(0,247,113,0.1)' 
                          : (isDark ? '#111' : '#f8f8f8'),
                        borderColor: onboardingData.experienceLevel === level.id 
                          ? 'var(--neon)' 
                          : (isDark ? '#222' : '#eee')
                      }}
                    >
                      <span className="text-4xl">{level.emoji}</span>
                      <div className="flex-1">
                        <p className="text-lg font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                          {level.label}
                        </p>
                        <p style={{ color: isDark ? '#888' : '#666' }}>{level.desc}</p>
                      </div>
                      {onboardingData.experienceLevel === level.id && (
                        <CheckCircle2 className="w-6 h-6" style={{ color: 'var(--neon)' }} />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Preferences */}
            {onboardingStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-bold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
                  Learning preferences
                </h2>
                <p className="mb-8" style={{ color: isDark ? '#888' : '#666' }}>
                  Customize your experience
                </p>

                <div className="space-y-8">
                  {/* Learning Style */}
                  <div>
                    <label className="block text-sm font-medium mb-4" style={{ color: isDark ? '#fff' : '#000' }}>
                      How do you learn best?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {LEARNING_STYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => updateOnboardingData({ learningStyle: style.id as any })}
                          className="p-4 rounded-xl border-2 transition-all text-left"
                          style={{ 
                            background: onboardingData.learningStyle === style.id 
                              ? 'rgba(0,247,113,0.1)' 
                              : (isDark ? '#111' : '#f8f8f8'),
                            borderColor: onboardingData.learningStyle === style.id 
                              ? 'var(--neon)' 
                              : (isDark ? '#222' : '#eee')
                          }}
                        >
                          <span className="text-2xl mb-2 block">{style.emoji}</span>
                          <p className="font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>{style.label}</p>
                          <p className="text-sm" style={{ color: isDark ? '#888' : '#666' }}>{style.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hours */}
                  <div>
                    <label className="block text-sm font-medium mb-4" style={{ color: isDark ? '#fff' : '#000' }}>
                      Hours per week
                    </label>
                    <div 
                      className="p-6 rounded-xl border"
                      style={{ 
                        background: isDark ? '#111' : '#f8f8f8',
                        borderColor: isDark ? '#222' : '#eee'
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-4xl font-bold glow-text">{onboardingData.hoursPerWeek}</span>
                        <span style={{ color: isDark ? '#888' : '#666' }}>hours/week</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="40"
                        value={onboardingData.hoursPerWeek}
                        onChange={(e) => updateOnboardingData({ hoursPerWeek: parseInt(e.target.value) })}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{ background: isDark ? '#333' : '#ddd', accentColor: 'var(--neon)' }}
                      />
                    </div>
                  </div>

                  {/* Pace */}
                  <div>
                    <label className="block text-sm font-medium mb-4" style={{ color: isDark ? '#fff' : '#000' }}>
                      Preferred pace
                    </label>
                    <div className="flex gap-3">
                      {['slow', 'moderate', 'fast'].map((pace) => (
                        <button
                          key={pace}
                          onClick={() => updateOnboardingData({ learningPace: pace as any })}
                          className="flex-1 py-3 rounded-xl border-2 transition-all capitalize font-medium"
                          style={{ 
                            background: onboardingData.learningPace === pace 
                              ? 'var(--neon)' 
                              : (isDark ? '#111' : '#f8f8f8'),
                            borderColor: onboardingData.learningPace === pace 
                              ? 'var(--neon)' 
                              : (isDark ? '#222' : '#eee'),
                            color: onboardingData.learningPace === pace ? '#000' : (isDark ? '#888' : '#666')
                          }}
                        >
                          {pace}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={prevStep}
              disabled={onboardingStep === 1}
              className="btn btn-ghost"
              style={{ opacity: onboardingStep === 1 ? 0 : 1 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {onboardingStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="btn btn-primary"
                style={{ opacity: canProceed() ? 1 : 0.5 }}
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isLoading}
                className="btn btn-primary"
                style={{ opacity: canProceed() && !isLoading ? 1 : 0.5 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate My Roadmap
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
