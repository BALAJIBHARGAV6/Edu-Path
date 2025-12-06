'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle2, Clock, Play, ChevronRight, BookOpen, Video, Code2, 
  FileText, Target, ArrowRight, Sparkles, Lock, Circle
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

// Default starter concepts when no roadmap exists
const starterConcepts = [
  { id: 1, title: 'HTML Fundamentals', desc: 'Structure of web pages', category: 'Frontend', duration: '2 hours' },
  { id: 2, title: 'CSS Basics', desc: 'Styling and layouts', category: 'Frontend', duration: '3 hours' },
  { id: 3, title: 'JavaScript Essentials', desc: 'Core programming concepts', category: 'Frontend', duration: '5 hours' },
  { id: 4, title: 'DOM Manipulation', desc: 'Interacting with web pages', category: 'Frontend', duration: '3 hours' },
  { id: 5, title: 'Responsive Design', desc: 'Mobile-first approach', category: 'Frontend', duration: '2 hours' },
  { id: 6, title: 'Git Version Control', desc: 'Code collaboration', category: 'Tools', duration: '2 hours' },
  { id: 7, title: 'React Basics', desc: 'Component-based UI', category: 'Frontend', duration: '4 hours' },
  { id: 8, title: 'State Management', desc: 'Managing app data', category: 'Frontend', duration: '3 hours' },
  { id: 9, title: 'API Integration', desc: 'Fetching data', category: 'Backend', duration: '3 hours' },
  { id: 10, title: 'Debugging Skills', desc: 'Finding and fixing bugs', category: 'Tools', duration: '2 hours' },
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { currentRoadmap, onboardingData } = useStore()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [completedConcepts, setCompletedConcepts] = useState<number[]>([])

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00F771', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  const userName = onboardingData.fullName || user.email?.split('@')[0] || 'Learner'
  const hasRoadmap = !!currentRoadmap
  
  // Get milestones from roadmap
  const milestones = currentRoadmap?.milestones || currentRoadmap?.ai_generated_path?.milestones || []
  
  // Flatten topics from all milestones to get learning concepts
  const learningConcepts = hasRoadmap && milestones.length > 0
    ? milestones.flatMap((m: any, mi: number) => 
        (m.topics || []).map((t: any, ti: number) => ({
          id: mi * 100 + ti,
          title: t.name || t.title,
          desc: t.description || m.title,
          category: m.title,
          duration: `${m.estimatedWeeks || 2} weeks`,
          isCompleted: t.isCompleted || false,
          status: m.status
        }))
      ).slice(0, 10)
    : starterConcepts

  const toggleConcept = (id: number) => {
    setCompletedConcepts(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const completedCount = hasRoadmap 
    ? learningConcepts.filter((c: any) => c.isCompleted).length 
    : completedConcepts.length
  const progressPercent = Math.round((completedCount / learningConcepts.length) * 100)

  return (
    <div className="min-h-screen pt-24 pb-16 px-6" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
      <div className="max-w-5xl mx-auto">
        
        {/* Welcome Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" style={{ color: '#00FFE0' }} />
            <span className="text-sm font-medium" style={{ color: '#00FFE0' }}>
              {hasRoadmap ? 'Continue Learning' : 'Get Started'}
            </span>
          </div>
          <h1 className="text-3xl font-black" style={{ color: isDark ? '#fff' : '#000' }}>
            Hello, {userName}! 👋
          </h1>
          <p className="text-base mt-1" style={{ color: isDark ? '#888' : '#666' }}>
            {hasRoadmap 
              ? `You're on the ${currentRoadmap.skill?.name || 'Learning'} path` 
              : 'Start with these fundamental concepts'}
          </p>
        </motion.div>

        {/* Progress Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-2xl"
          style={{ 
            background: isDark ? 'rgba(20,20,25,0.8)' : 'rgba(255,255,255,0.9)', 
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` 
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
                {hasRoadmap ? currentRoadmap.skill?.name || 'Your Learning Path' : 'Starter Concepts'}
              </h2>
              <p className="text-sm" style={{ color: isDark ? '#888' : '#666' }}>
                {completedCount} of {learningConcepts.length} completed
              </p>
            </div>
            {!hasRoadmap && (
              <Link href="/roadmaps">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ background: 'rgba(0,255,224,0.15)', color: '#00FFE0', border: '1px solid rgba(0,255,224,0.3)' }}
                >
                  <Target className="w-4 h-4" />
                  Generate Roadmap
                </motion.button>
              </Link>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="h-3 rounded-full overflow-hidden" style={{ background: isDark ? '#1a1a1a' : '#eee' }}>
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${progressPercent}%` }} 
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00FFE0, #00F771)' }}
            />
          </div>
          <p className="text-right text-sm mt-2 font-medium" style={{ color: '#00F771' }}>{progressPercent}%</p>
        </motion.div>

        {/* Learning Concepts Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-bold mb-4" style={{ color: isDark ? '#fff' : '#000' }}>
            {hasRoadmap ? 'Topics to Learn' : '10 Essential Concepts'}
          </h2>
          
          <div className="grid gap-3">
            {learningConcepts.map((concept: any, i: number) => {
              const isCompleted = hasRoadmap ? concept.isCompleted : completedConcepts.includes(concept.id)
              const isLocked = hasRoadmap && concept.status === 'locked' && i > 2
              
              return (
                <motion.div
                  key={concept.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${isLocked ? 'opacity-50' : 'cursor-pointer'}`}
                  style={{ 
                    background: isCompleted 
                      ? (isDark ? 'rgba(0,247,113,0.1)' : 'rgba(0,247,113,0.08)')
                      : (isDark ? 'rgba(20,20,25,0.8)' : 'rgba(255,255,255,0.9)'),
                    border: `1px solid ${isCompleted ? 'rgba(0,247,113,0.3)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')}`
                  }}
                  onClick={() => !isLocked && !hasRoadmap && toggleConcept(concept.id)}
                >
                  {/* Number/Status */}
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ 
                      background: isCompleted 
                        ? 'rgba(0,247,113,0.2)' 
                        : isLocked 
                          ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')
                          : 'rgba(0,255,224,0.15)',
                      border: isCompleted ? '1px solid rgba(0,247,113,0.4)' : '1px solid rgba(0,255,224,0.3)'
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" style={{ color: '#00F771' }} />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" style={{ color: isDark ? '#666' : '#888' }} />
                    ) : (
                      <span className="text-sm font-bold" style={{ color: '#00FFE0' }}>{i + 1}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm ${isCompleted ? 'line-through opacity-70' : ''}`} 
                      style={{ color: isDark ? '#fff' : '#000' }}
                    >
                      {concept.title}
                    </h3>
                    <p className="text-xs truncate" style={{ color: isDark ? '#666' : '#888' }}>
                      {concept.desc}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs px-2 py-1 rounded-lg" 
                      style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: isDark ? '#888' : '#666' }}
                    >
                      {concept.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs" style={{ color: isDark ? '#666' : '#888' }}>
                      <Clock className="w-3 h-3" />
                      {concept.duration}
                    </div>
                    {!isLocked && !isCompleted && (
                      <ChevronRight className="w-4 h-4" style={{ color: isDark ? '#666' : '#888' }} />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: isDark ? '#fff' : '#000' }}>Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Target, label: 'Roadmaps', href: '/roadmaps', color: '#00F771' },
              { icon: Code2, label: 'Practice', href: '/practice', color: '#B794F6' },
              { icon: Video, label: 'Videos', href: '/videos', color: '#00FFE0' },
              { icon: FileText, label: 'Resources', href: '/resources', color: '#FF6B9D' },
            ].map((action) => (
              <Link key={action.label} href={action.href}>
                <motion.div 
                  whileHover={{ y: -4 }} 
                  className="p-4 rounded-xl text-center cursor-pointer"
                  style={{ 
                    background: isDark ? 'rgba(20,20,25,0.8)' : 'rgba(255,255,255,0.9)', 
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` 
                  }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2"
                    style={{ background: `${action.color}15` }}
                  >
                    <action.icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>{action.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
