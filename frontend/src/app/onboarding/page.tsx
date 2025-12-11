'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Target, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useStore } from '@/lib/store'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import PageWrapper from '@/components/PageWrapper'
import Navbar from '@/components/Navbar'

const CAREER_GOALS = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer', 'DevOps Engineer', 'Data Scientist']
const EXPERIENCE: Array<'beginner' | 'intermediate' | 'advanced'> = ['beginner' as const, 'intermediate' as const, 'advanced' as const]
const LEARNING_STYLES: Array<'visual' | 'reading' | 'hands-on' | 'mixed'> = ['visual' as const, 'reading' as const, 'hands-on' as const, 'mixed' as const]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { onboardingStep, setOnboardingStep, onboardingData, updateOnboardingData, setLoading, isLoading } = useStore()
  const [step, setStep] = useState(1)

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  const handleNext = () => setStep(Math.min(step + 1, 4))
  const handlePrev = () => setStep(Math.max(step - 1, 1))

  const canProceed = () => {
    switch (step) {
      case 1: return onboardingData.fullName && onboardingData.careerGoal
      case 2: return onboardingData.experienceLevel
      case 3: return onboardingData.learningStyle
      case 4: return onboardingData.hoursPerWeek > 0
      default: return false
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

  return (
    <PageWrapper>
      <Navbar />
      <div className="min-h-screen pt-20" style={{ background: bg }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Progress */}
          <div className="mb-12">
            <div className="flex justify-between text-sm mb-4">
              <span style={{ color: text }} className="font-medium">Step {step} of 4</span>
              <span style={{ color: accent }} className="font-semibold">{step * 25}%</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: subtle }}>
              <motion.div
                animate={{ width: `${step * 25}%` }}
                className="h-full rounded-full transition-all"
                style={{ background: accent }}
              />
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-3" style={{ color: text }}>Let's get started</h2>
                  <p style={{ color: muted }}>Tell us about yourself and your career goals</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: text }}>Full Name</label>
                    <input
                      type="text"
                      value={onboardingData.fullName}
                      onChange={(e) => updateOnboardingData({ fullName: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      style={{ background: subtle, color: text, border: `1px solid ${border}` }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: text }}>Career Goal</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CAREER_GOALS.map((goal) => (
                        <button
                          key={goal}
                          onClick={() => updateOnboardingData({ careerGoal: goal })}
                          className="p-4 rounded-xl text-left font-medium transition-all"
                          style={{
                            background: onboardingData.careerGoal === goal ? accent : subtle,
                            color: onboardingData.careerGoal === goal ? 'white' : text,
                            border: `1px solid ${onboardingData.careerGoal === goal ? accent : border}`
                          }}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-3" style={{ color: text }}>Experience level</h2>
                  <p style={{ color: muted }}>Where are you in your journey?</p>
                </div>

                <div className="space-y-4">
                  {EXPERIENCE.map((level) => (
                    <button
                      key={level}
                      onClick={() => updateOnboardingData({ experienceLevel: level as 'beginner' | 'intermediate' | 'advanced' })}
                      className="w-full p-6 rounded-xl text-left font-medium transition-all flex items-center justify-between"
                      style={{
                        background: onboardingData.experienceLevel === level ? accent : subtle,
                        color: onboardingData.experienceLevel === level ? 'white' : text,
                        border: `1px solid ${onboardingData.experienceLevel === level ? accent : border}`
                      }}
                    >
                      <span>{level}</span>
                      {onboardingData.experienceLevel === level && <CheckCircle2 className="w-5 h-5" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-3" style={{ color: text }}>Learning style</h2>
                  <p style={{ color: muted }}>How do you learn best?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {LEARNING_STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => updateOnboardingData({ learningStyle: style as 'visual' | 'reading' | 'hands-on' | 'mixed' })}
                      className="p-6 rounded-xl text-left font-medium transition-all"
                      style={{
                        background: onboardingData.learningStyle === style ? accent : subtle,
                        color: onboardingData.learningStyle === style ? 'white' : text,
                        border: `1px solid ${onboardingData.learningStyle === style ? accent : border}`
                      }}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-3" style={{ color: text }}>Learning schedule</h2>
                  <p style={{ color: muted }}>How many hours per week can you dedicate?</p>
                </div>

                <div className="p-8 rounded-xl" style={{ background: subtle }}>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold mb-2" style={{ color: accent }}>{onboardingData.hoursPerWeek}</div>
                    <p style={{ color: muted }}>hours per week</p>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={onboardingData.hoursPerWeek}
                    onChange={(e) => updateOnboardingData({ hoursPerWeek: parseInt(e.target.value) })}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: accent }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
              style={{
                background: subtle,
                color: text,
                opacity: step === 1 ? 0.5 : 1,
                cursor: step === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
                style={{
                  background: accent,
                  opacity: canProceed() ? 1 : 0.5,
                  cursor: canProceed() ? 'pointer' : 'not-allowed'
                }}
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all hover:scale-105"
                style={{
                  background: accent,
                  opacity: canProceed() && !isLoading ? 1 : 0.5,
                  cursor: canProceed() && !isLoading ? 'pointer' : 'not-allowed'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Roadmap
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
