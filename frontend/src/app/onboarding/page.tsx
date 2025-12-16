'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Target, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useStore } from '@/lib/store'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { supabase } from '@/lib/supabase'
import PageWrapper from '@/components/PageWrapper'
import Navbar from '@/components/Navbar'

const CAREER_GOALS = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Mobile Developer', 'DevOps Engineer', 'Data Scientist']
const EXPERIENCE: Array<'beginner' | 'intermediate' | 'advanced'> = ['beginner' as const, 'intermediate' as const, 'advanced' as const]
const LEARNING_STYLES: Array<'visual' | 'reading' | 'hands-on' | 'mixed'> = ['visual' as const, 'reading' as const, 'hands-on' as const, 'mixed' as const]

const COMMON_SKILLS = [
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js',
  'Node.js', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go',
  'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Git', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'REST API', 'GraphQL', 'Redux', 'Next.js'
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { setCurrentRoadmap } = useStore()
  const [step, setStep] = useState(1)
  const [isLoading, setLoading] = useState(false)
  
  // Fresh state - not from Zustand store
  const [formData, setFormData] = useState({
    fullName: '',
    careerGoal: '',
    experienceLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    skills: [] as string[],
    learningStyle: 'mixed' as 'visual' | 'reading' | 'hands-on' | 'mixed',
    hoursPerWeek: 10,
  })

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  const handleNext = () => setStep(Math.min(step + 1, 5))
  const handlePrev = () => setStep(Math.max(step - 1, 1))

  const canProceed = () => {
    switch (step) {
      case 1: return formData.fullName && formData.careerGoal
      case 2: return formData.experienceLevel
      case 3: return true // Skills are optional
      case 4: return formData.learningStyle
      case 5: return formData.hoursPerWeek > 0
      default: return false
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user?.id) {
        throw new Error('No user session found')
      }

      console.log('Starting onboarding submission for user:', session.user.id)
      console.log('Form data:', formData)

      // Save user profile with all onboarding data including skills
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: session.user.id,
          fullName: formData.fullName,
          email: session.user.email,
          careerGoal: formData.careerGoal,
          experienceLevel: formData.experienceLevel,
          learningStyle: formData.learningStyle,
          hoursPerWeek: formData.hoursPerWeek,
          skills: formData.skills || [],
        }),
      })

      console.log('Profile response status:', profileResponse.status)
      
      if (!profileResponse.ok) {
        const errorText = await profileResponse.text()
        console.error('Profile save failed:', errorText)
        throw new Error(`Failed to save profile: ${errorText}`)
      }

      const profileData = await profileResponse.json()
      console.log('Profile saved successfully:', profileData)
      
      if (!profileData.success) {
        throw new Error(profileData.error || 'Failed to save profile')
      }

      // Generate roadmap with saved profile data
      console.log('Generating roadmap...')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_id: session.user.id,
        }),
      })
      
      console.log('Roadmap response status:', response.status)
      
      const data = await response.json()
      if (data.success) {
        // Save roadmap to store
        if (data.roadmap) {
          setCurrentRoadmap(data.roadmap)
        }
        toast.success('Your personalized roadmap is ready!')
        router.push('/dashboard')
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      console.error('Error generating roadmap:', error)
      toast.error(error.message || 'Failed to generate roadmap. Please try again.')
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
              <span style={{ color: text }} className="font-medium">Step {step} of 5</span>
              <span style={{ color: accent }} className="font-semibold">{step * 20}%</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: subtle }}>
              <motion.div
                animate={{ width: `${step * 20}%` }}
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
                      value={formData.fullName}
                      onChange={(e) => updateFormData({ fullName: e.target.value })}
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
                          onClick={() => updateFormData({ careerGoal: goal })}
                          className="p-4 rounded-xl text-left font-medium transition-all"
                          style={{
                            background: formData.careerGoal === goal ? accent : subtle,
                            color: formData.careerGoal === goal ? 'white' : text,
                            border: `1px solid ${formData.careerGoal === goal ? accent : border}`
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
                      onClick={() => updateFormData({ experienceLevel: level as 'beginner' | 'intermediate' | 'advanced' })}
                      className="w-full p-6 rounded-xl text-left font-medium transition-all flex items-center justify-between"
                      style={{
                        background: formData.experienceLevel === level ? accent : subtle,
                        color: formData.experienceLevel === level ? 'white' : text,
                        border: `1px solid ${formData.experienceLevel === level ? accent : border}`
                      }}
                    >
                      <span>{level}</span>
                      {formData.experienceLevel === level && <CheckCircle2 className="w-5 h-5" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3 - Skills */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-3" style={{ color: text }}>Previous Skills</h2>
                  <p style={{ color: muted }}>Select the skills you already have (optional)</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(formData.skills || []).map((skill) => (
                    <div
                      key={skill}
                      className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                      style={{ background: accent, color: 'white' }}
                    >
                      {skill}
                      <button
                        onClick={() => updateFormData({ 
                          skills: (formData.skills || []).filter(s => s !== skill) 
                        })}
                        className="hover:opacity-70"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {COMMON_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => {
                        const currentSkills = formData.skills || []
                        if (currentSkills.includes(skill)) {
                          updateFormData({ 
                            skills: currentSkills.filter(s => s !== skill) 
                          })
                        } else {
                          updateFormData({ 
                            skills: [...currentSkills, skill] 
                          })
                        }
                      }}
                      className="p-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: (formData.skills || []).includes(skill) ? accent : subtle,
                        color: (formData.skills || []).includes(skill) ? 'white' : text,
                        border: `1px solid ${(formData.skills || []).includes(skill) ? accent : border}`
                      }}
                    >
                      {skill}
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
                  <h2 className="text-3xl font-bold mb-3" style={{ color: text }}>Learning style</h2>
                  <p style={{ color: muted }}>How do you learn best?</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {LEARNING_STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => updateFormData({ learningStyle: style as 'visual' | 'reading' | 'hands-on' | 'mixed' })}
                      className="p-6 rounded-xl text-left font-medium transition-all"
                      style={{
                        background: formData.learningStyle === style ? accent : subtle,
                        color: formData.learningStyle === style ? 'white' : text,
                        border: `1px solid ${formData.learningStyle === style ? accent : border}`
                      }}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <motion.div
                key="step5"
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
                    <div className="text-5xl font-bold mb-2" style={{ color: accent }}>{formData.hoursPerWeek}</div>
                    <p style={{ color: muted }}>hours per week</p>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={formData.hoursPerWeek}
                    onChange={(e) => updateFormData({ hoursPerWeek: parseInt(e.target.value) })}
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

            {step < 5 ? (
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
