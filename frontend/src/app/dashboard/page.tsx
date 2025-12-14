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
import { supabase } from '@/lib/supabase'
import PageWrapper from '@/components/PageWrapper'
import GradientText from '@/components/GradientText'
import toast from 'react-hot-toast'

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
  const { currentRoadmap, onboardingData, userProgress, userSkills, markConceptComplete, setCurrentRoadmap } = useStore()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [loadingRoadmap, setLoadingRoadmap] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }

    // Load roadmap from Supabase if not in store
    const loadRoadmap = async () => {
      if (user && !currentRoadmap) {
        try {
          const { data: roadmaps, error } = await supabase
            .from('roadmaps')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
          
          if (!error && roadmaps && roadmaps.length > 0) {
            setCurrentRoadmap(roadmaps[0])
          } else {
            // No roadmap found, redirect to onboarding
            router.push('/onboarding')
          }
        } catch (err) {
          console.error('Error loading roadmap:', err)
          router.push('/onboarding')
        } finally {
          setLoadingRoadmap(false)
        }
      } else {
        setLoadingRoadmap(false)
      }
    }

    if (!authLoading) {
      loadRoadmap()
    }
  }, [authLoading, user, currentRoadmap, router, setCurrentRoadmap])

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
    const wasCompleted = userProgress.completedConcepts.includes(id)
    
    // Update the global progress state
    markConceptComplete(id)
    
    // Find current concept index
    const currentIndex = learningConcepts.findIndex((c: any) => c.id === id)
    const nextConcept = learningConcepts[currentIndex + 1]
    
    if (!wasCompleted) {
      // Concept was just completed
      toast.success('Great job! Concept completed! 🎉✨')
      
      // Check if there's a next concept to unlock
      if (nextConcept && currentIndex < learningConcepts.length - 1) {
        setTimeout(() => {
          toast.success(`🔓 "${nextConcept.title}" unlocked! Keep going! 🚀`, {
            duration: 4000,
          })
        }, 1000)
      } else if (currentIndex === learningConcepts.length - 1) {
        // Last concept completed
        setTimeout(() => {
          toast.success('🎊 Congratulations! All concepts completed! 🎊', {
            duration: 5000,
          })
        }, 1000)
      }
    } else {
      // Concept was unmarked
      toast.success('Concept unmarked! Keep learning! 📚')
    }
    
    // Log for debugging
    console.log('Concept toggled:', id, 'Index:', currentIndex, 'Next:', nextConcept?.title)
  }

  // Calculate completed count based on global progress state
  const completedCount = learningConcepts.filter((concept: any) => 
    userProgress.completedConcepts.includes(concept.id)
  ).length
  const progressPercent = Math.round((completedCount / learningConcepts.length) * 100)

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  const stats = [
    { title: 'Concepts Learned', value: completedCount.toString(), change: '+12%', color: '#10B981', icon: CheckCircle2 },
    { title: 'Study Hours', value: '24h', change: '+8%', color: '#F59E0B', icon: Clock },
    { title: 'Videos Watched', value: '15', change: '+25%', color: '#EF4444', icon: Play },
    { title: 'Progress', value: `${progressPercent}%`, change: '+15%', color: '#8B5CF6', icon: Target },
  ]

  return (
    <PageWrapper>
      <div className="min-h-screen pt-16 sm:pt-20 md:pt-24" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section - EXACT Same as Home Page */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          {/* Badge - EXACT Same Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ 
              background: 'rgba(37,99,235,0.1)',
              border: '1px solid rgba(37,99,235,0.2)'
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: accent }} />
            <span className="text-sm font-medium" style={{ color: accent }}>Your Learning Journey</span>
          </motion.div>
          
          {/* Main Heading - EXACT Same Style */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ color: text }}>
            Welcome back, <GradientText>{user?.email?.split('@')[0] || 'Learner'}</GradientText>
          </h1>
          
          {/* Description - EXACT Same Style */}
          <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-8" style={{ color: muted }}>
            Track your progress, continue your learning journey, and achieve your goals with personalized insights.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Background Gradient */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(135deg, ${stat.color}10, ${stat.color}05)` }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                    style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}CC)` }}
                  >
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="text-xs font-bold px-3 py-1.5 rounded-full shadow-sm"
                    style={{ background: stat.color + '20', color: stat.color }}
                  >
                    {stat.change}
                  </motion.span>
                </div>
                <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
              {hasRoadmap ? 'Topics to Learn' : '10 Essential Concepts'}
            </h2>
            <p className="text-sm" style={{ color: muted }}>
              💡 Click to complete • 🔓 Unlocks next concept
            </p>
          </div>
          
          <div className="grid gap-3">
            {learningConcepts.map((concept: any, i: number) => {
              const isCompleted = userProgress.completedConcepts.includes(concept.id)
              
              // Sequential unlocking logic
              const isLocked = (() => {
                // First concept is always unlocked
                if (i === 0) return false
                
                // Check if previous concept is completed
                const previousConcept = learningConcepts[i - 1]
                const isPreviousCompleted = userProgress.completedConcepts.includes(previousConcept.id)
                
                // Lock if previous concept is not completed
                return !isPreviousCompleted
              })()
              
              return (
                <motion.div
                  key={concept.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    scale: isLocked ? 0.98 : 1
                  }}
                  transition={{ 
                    delay: 0.05 * i,
                    scale: { duration: 0.2 }
                  }}
                  whileHover={!isLocked ? { scale: 1.02 } : {}}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isLocked 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]'
                  }`}
                  style={{ 
                    background: isCompleted 
                      ? (isDark ? 'rgba(0,247,113,0.1)' : 'rgba(0,247,113,0.08)')
                      : (isDark ? 'rgba(20,20,25,0.8)' : 'rgba(255,255,255,0.9)'),
                    border: `1px solid ${isCompleted ? 'rgba(0,247,113,0.3)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')}`
                  }}
                  onClick={() => {
                    if (isLocked) {
                      toast.error('🔒 Complete the previous concept first!', { duration: 2000 })
                    } else {
                      toggleConcept(concept.id)
                    }
                  }}
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
    </PageWrapper>
  )
}
