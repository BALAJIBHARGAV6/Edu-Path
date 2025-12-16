'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle2, Clock, Play, ChevronRight, BookOpen, Video, Code2, 
  FileText, Target, Sparkles, Lock, TrendingUp, Flame, Trophy,
  Calendar, Zap, Star, ArrowRight, BarChart3, MessageSquare
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
  const { currentRoadmap, onboardingData, userProgress, markConceptComplete, setCurrentRoadmap } = useStore()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [loadingRoadmap, setLoadingRoadmap] = useState(true)
  const [loadingStats, setLoadingStats] = useState(true)
  const [streak, setStreak] = useState(0)
  const [totalXP, setTotalXP] = useState(0)
  const [userProfile, setUserProfile] = useState<any>(null)

  // Fetch real user stats from database
  useEffect(() => {
    async function fetchUserStats() {
      if (user) {
        try {
          // Fetch user profile with stats
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${user.id}`)
          const data = await response.json()
          
          if (data.success && data.profile) {
            setUserProfile(data.profile)
            setStreak(data.profile.streak_count || 0)
            setTotalXP(data.profile.total_xp || 0)
          }
        } catch (error) {
          console.error('Error fetching user stats:', error)
        } finally {
          setLoadingStats(false)
        }
      }
    }
    fetchUserStats()
  }, [user])

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
          
          if (error) {
            console.error('No roadmap found or error:', error)
            // Don't redirect, show starter concepts instead
            setLoadingRoadmap(false)
            return
          }
          
          if (roadmaps && roadmaps.length > 0) {
            setCurrentRoadmap(roadmaps[0])
          }
        } catch (err) {
          console.error('Error loading roadmap:', err)
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
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#3B82F6', borderTopColor: 'transparent' }} />
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
    markConceptComplete(id)
    const currentIndex = learningConcepts.findIndex((c: any) => c.id === id)
    const nextConcept = learningConcepts[currentIndex + 1]
    
    if (!wasCompleted) {
      setTotalXP(prev => prev + 50)
      toast.success('🎉 +50 XP! Concept completed!')
      
      if (nextConcept && currentIndex < learningConcepts.length - 1) {
        setTimeout(() => {
          toast.success(`🔓 "${nextConcept.title}" unlocked!`, { duration: 3000 })
        }, 800)
      } else if (currentIndex === learningConcepts.length - 1) {
        setTimeout(() => {
          toast.success('🏆 All concepts completed! Amazing work!', { duration: 5000 })
        }, 800)
      }
    } else {
      setTotalXP(prev => prev - 50)
      toast.success('Concept unmarked')
    }
  }

  const completedCount = learningConcepts.filter((concept: any) => 
    userProgress.completedConcepts.includes(concept.id)
  ).length
  const progressPercent = Math.round((completedCount / learningConcepts.length) * 100)

  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'

  // Stats data
  const stats = [
    { 
      title: 'Learning Streak', 
      value: `${streak} days`, 
      icon: Flame, 
      color: '#F59E0B',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      title: 'Total XP', 
      value: totalXP.toLocaleString(), 
      icon: Zap, 
      color: '#8B5CF6',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      title: 'Concepts Done', 
      value: `${completedCount}/${learningConcepts.length}`, 
      icon: CheckCircle2, 
      color: '#10B981',
      gradient: 'from-emerald-500 to-teal-500'
    },
    { 
      title: 'Progress', 
      value: `${progressPercent}%`, 
      icon: TrendingUp, 
      color: '#3B82F6',
      gradient: 'from-blue-500 to-cyan-500'
    },
  ]

  // Quick actions
  const quickActions = [
    { icon: Target, label: 'Roadmaps', href: '/roadmaps', color: '#10B981', desc: 'View learning paths' },
    { icon: Code2, label: 'Practice', href: '/practice', color: '#8B5CF6', desc: 'Coding challenges' },
    { icon: Video, label: 'Videos', href: '/videos', color: '#F59E0B', desc: 'Tutorial videos' },
    { icon: MessageSquare, label: 'AI Chat', href: '/resources', color: '#3B82F6', desc: 'Ask questions' },
  ]

  return (
    <PageWrapper>
      <div className="min-h-screen pt-16 sm:pt-20 md:pt-24" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
              >
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-500">Welcome back!</span>
              </motion.div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ color: text }}>
                Hey, <GradientText>{userName}</GradientText> 👋
              </h1>
              <p className="text-base sm:text-lg mt-2" style={{ color: muted }}>
                Ready to continue your learning journey?
              </p>
            </div>
            
            {/* Streak Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ 
                background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(239,68,68,0.1))',
                border: '1px solid rgba(249,115,22,0.2)'
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: text }}>{streak}</p>
                <p className="text-xs" style={{ color: muted }}>Day Streak 🔥</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl p-4 sm:p-5"
              style={{ 
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${border}`
              }}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -translate-y-8 translate-x-8`} />
              <div className="relative z-10">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${stat.color}20` }}
                >
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: stat.color }} />
                </div>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: text }}>{stat.value}</p>
                <p className="text-xs sm:text-sm" style={{ color: muted }}>{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Progress Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 rounded-2xl overflow-hidden"
            style={{ 
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
              border: `1px solid ${border}`
            }}
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b" style={{ borderColor: border }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold" style={{ color: text }}>
                      {hasRoadmap ? currentRoadmap.skill?.name || 'Your Learning Path' : 'Starter Concepts'}
                    </h2>
                    <p className="text-sm" style={{ color: muted }}>
                      {completedCount} of {learningConcepts.length} completed
                    </p>
                  </div>
                </div>
                {!hasRoadmap && (
                  <Link href="/roadmaps">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate Roadmap
                    </motion.button>
                  </Link>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="relative">
                <div className="h-3 rounded-full overflow-hidden" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${progressPercent}%` }} 
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs" style={{ color: muted }}>Progress</span>
                  <span className="text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    {progressPercent}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Concepts List */}
            <div className="p-4 sm:p-6 max-h-[400px] overflow-y-auto">
              <div className="space-y-2">
                {learningConcepts.slice(0, 6).map((concept: any, i: number) => {
                  const isCompleted = userProgress.completedConcepts.includes(concept.id)
                  const isLocked = i > 0 && !userProgress.completedConcepts.includes(learningConcepts[i - 1].id)
                  
                  return (
                    <motion.div
                      key={concept.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      whileHover={!isLocked ? { x: 4 } : {}}
                      onClick={() => isLocked ? toast.error('🔒 Complete previous concept first!') : toggleConcept(concept.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        isLocked ? 'opacity-50' : 'hover:bg-white/5'
                      }`}
                      style={{ 
                        background: isCompleted 
                          ? 'rgba(16,185,129,0.1)' 
                          : 'transparent',
                        border: `1px solid ${isCompleted ? 'rgba(16,185,129,0.3)' : 'transparent'}`
                      }}
                    >
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ 
                          background: isCompleted 
                            ? 'rgba(16,185,129,0.2)' 
                            : isLocked 
                              ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')
                              : 'rgba(59,130,246,0.1)'
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : isLocked ? (
                          <Lock className="w-4 h-4" style={{ color: muted }} />
                        ) : (
                          <span className="text-sm font-bold text-blue-500">{i + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-sm ${isCompleted ? 'line-through opacity-70' : ''}`} style={{ color: text }}>
                          {concept.title}
                        </h3>
                        <p className="text-xs truncate" style={{ color: muted }}>{concept.desc}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-lg hidden sm:block" 
                          style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: muted }}
                        >
                          {concept.category}
                        </span>
                        {!isLocked && !isCompleted && (
                          <ChevronRight className="w-4 h-4" style={{ color: muted }} />
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              
              {learningConcepts.length > 6 && (
                <Link href="/roadmaps">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full mt-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                    style={{ 
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      color: text
                    }}
                  >
                    View All {learningConcepts.length} Concepts
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-5"
              style={{ 
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${border}`
              }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: text }}>Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, i) => (
                  <Link key={action.label} href={action.href}>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="p-4 rounded-xl text-center cursor-pointer transition-all"
                      style={{ 
                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        border: `1px solid ${border}`
                      }}
                    >
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                        style={{ background: `${action.color}15` }}
                      >
                        <action.icon className="w-5 h-5" style={{ color: action.color }} />
                      </div>
                      <p className="text-sm font-medium" style={{ color: text }}>{action.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: muted }}>{action.desc}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Achievement Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
              className="rounded-2xl p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
              style={{ border: '1px solid rgba(139,92,246,0.2)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: text }}>Achievements</h3>
                  <p className="text-xs" style={{ color: muted }}>Keep learning to unlock!</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'First Steps', desc: 'Complete 1 concept', done: completedCount >= 1 },
                  { name: 'Getting Started', desc: 'Complete 5 concepts', done: completedCount >= 5 },
                  { name: 'On Fire', desc: '7 day streak', done: streak >= 7 },
                ].map((badge, i) => (
                  <div 
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl ${badge.done ? 'opacity-100' : 'opacity-50'}`}
                    style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${badge.done ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : ''}`}
                      style={{ background: badge.done ? undefined : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') }}
                    >
                      <Star className={`w-4 h-4 ${badge.done ? 'text-white' : ''}`} style={{ color: badge.done ? undefined : muted }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: text }}>{badge.name}</p>
                      <p className="text-xs" style={{ color: muted }}>{badge.desc}</p>
                    </div>
                    {badge.done && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Daily Tip */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }}
              className="rounded-2xl p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
              style={{ border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold" style={{ color: text }}>Daily Tip</h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: muted }}>
                💡 Consistency beats intensity! Even 30 minutes of focused learning daily leads to remarkable progress over time.
              </p>
            </motion.div>
          </div>
        </div>
        </div>
      </div>
    </PageWrapper>
  )
}
