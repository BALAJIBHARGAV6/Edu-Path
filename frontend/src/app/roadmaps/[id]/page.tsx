'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft,
  BookmarkPlus,
  Share2,
  Clock,
  Users,
  Star,
  CheckCircle2,
  Lock,
  Play,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Download,
  Loader2,
  BookOpen,
  Check
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import PageWrapper from '@/components/PageWrapper'

// Sample roadmap data structure (like roadmap.sh)
const roadmapData: Record<string, any> = {
  'frontend-developer': {
    title: 'Frontend Developer',
    description: 'A complete guide to becoming a modern frontend developer in 2025',
    duration: '6-8 months',
    learners: 45200,
    rating: 4.9,
    gradient: 'from-blue-500 to-cyan-500',
    sections: [
      {
        id: 1,
        title: 'Internet & Web Basics',
        status: 'completed',
        topics: [
          { name: 'How does the Internet work?', completed: true },
          { name: 'What is HTTP/HTTPS?', completed: true },
          { name: 'How browsers work', completed: true },
          { name: 'DNS and how it works', completed: true },
        ]
      },
      {
        id: 2,
        title: 'HTML Fundamentals',
        status: 'completed',
        topics: [
          { name: 'HTML Basics & Syntax', completed: true },
          { name: 'Semantic HTML', completed: true },
          { name: 'Forms and Validations', completed: true },
          { name: 'Accessibility (a11y)', completed: true },
          { name: 'SEO Basics', completed: true },
        ]
      },
      {
        id: 3,
        title: 'CSS Fundamentals',
        status: 'current',
        topics: [
          { name: 'CSS Basics & Selectors', completed: true },
          { name: 'Box Model', completed: true },
          { name: 'Flexbox', completed: false },
          { name: 'CSS Grid', completed: false },
          { name: 'Responsive Design', completed: false },
          { name: 'CSS Variables', completed: false },
        ]
      },
      {
        id: 4,
        title: 'JavaScript',
        status: 'locked',
        topics: [
          { name: 'JavaScript Basics', completed: false },
          { name: 'DOM Manipulation', completed: false },
          { name: 'ES6+ Features', completed: false },
          { name: 'Async JavaScript', completed: false },
          { name: 'Fetch API & AJAX', completed: false },
        ]
      },
      {
        id: 5,
        title: 'Version Control',
        status: 'locked',
        topics: [
          { name: 'Git Basics', completed: false },
          { name: 'GitHub/GitLab', completed: false },
          { name: 'Branching Strategies', completed: false },
        ]
      },
      {
        id: 6,
        title: 'Package Managers',
        status: 'locked',
        topics: [
          { name: 'npm', completed: false },
          { name: 'yarn', completed: false },
          { name: 'pnpm', completed: false },
        ]
      },
      {
        id: 7,
        title: 'React',
        status: 'locked',
        topics: [
          { name: 'React Fundamentals', completed: false },
          { name: 'JSX', completed: false },
          { name: 'Components & Props', completed: false },
          { name: 'State & Lifecycle', completed: false },
          { name: 'Hooks', completed: false },
          { name: 'Context API', completed: false },
        ]
      },
      {
        id: 8,
        title: 'State Management',
        status: 'locked',
        topics: [
          { name: 'Redux', completed: false },
          { name: 'Zustand', completed: false },
          { name: 'React Query', completed: false },
        ]
      },
      {
        id: 9,
        title: 'CSS Frameworks',
        status: 'locked',
        topics: [
          { name: 'Tailwind CSS', completed: false },
          { name: 'Styled Components', completed: false },
          { name: 'CSS Modules', completed: false },
        ]
      },
      {
        id: 10,
        title: 'Testing',
        status: 'locked',
        topics: [
          { name: 'Jest', completed: false },
          { name: 'React Testing Library', completed: false },
          { name: 'Cypress', completed: false },
        ]
      },
    ]
  }
}

export default function RoadmapDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { currentRoadmap, setCurrentRoadmap } = useStore()
  const [roadmap, setRoadmap] = useState<any>(null)
  const [expandedSections, setExpandedSections] = useState<number[]>([1, 2, 3])
  const [expandedTopics, setExpandedTopics] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [completedTopics, setCompletedTopics] = useState<string[]>([])
  const [loadingProgress, setLoadingProgress] = useState(true)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Load roadmap from Supabase for current user
  useEffect(() => {
    const loadUserRoadmap = async () => {
      if (!user) return
      
      try {
        const { data: roadmaps, error } = await supabase
          .from('roadmaps')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
        
        if (!error && roadmaps && roadmaps.length > 0) {
          const userRoadmap = roadmaps[0]
          setRoadmap(userRoadmap)
          setCurrentRoadmap(userRoadmap)
          
          // Load progress from Supabase
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('completed_topics')
            .eq('user_id', user.id)
            .eq('roadmap_id', userRoadmap.id)
            .single()
          
          if (progressData?.completed_topics) {
            setCompletedTopics(progressData.completed_topics)
          }
        } else if (currentRoadmap) {
          // Fallback to store
          setRoadmap(currentRoadmap)
        }
      } catch (err) {
        console.error('Error loading roadmap:', err)
        // Fallback to sample data
        const id = params.id as string
        if (roadmapData[id]) {
          setRoadmap(roadmapData[id])
        }
      } finally {
        setLoadingProgress(false)
      }
    }
    
    loadUserRoadmap()
  }, [user, params.id, currentRoadmap, setCurrentRoadmap])

  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    )
  }

  const markTopicComplete = async (topicId: string, sectionId: number) => {
    if (!user || !roadmap) return
    
    const newCompleted = completedTopics.includes(topicId)
      ? completedTopics.filter(id => id !== topicId)
      : [...completedTopics, topicId]
    
    setCompletedTopics(newCompleted)
    
    // Save to Supabase
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          roadmap_id: roadmap.id,
          completed_topics: newCompleted,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,roadmap_id'
        })
      
      if (error) throw error
      
      if (!completedTopics.includes(topicId)) {
        toast.success('✅ Topic completed!')
      } else {
        toast.success('Topic unmarked')
      }
    } catch (err) {
      console.error('Error saving progress:', err)
      toast.error('Failed to save progress')
    }
  }

  const handleSaveRoadmap = async () => {
    if (!user) {
      toast.error('Please sign in to save roadmaps')
      router.push('/auth/login')
      return
    }

    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Roadmap saved to your account!')
    setSaving(false)
  }

  const handleStartLearning = () => {
    if (!user) {
      router.push('/auth/signup')
      return
    }
    router.push('/dashboard')
  }

  if (!roadmap || loadingProgress) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </PageWrapper>
    )
  }

  // Get sections from roadmap - handle both old format and new AI format
  const sections = roadmap.sections || roadmap.ai_generated_path?.milestones?.map((m: any, i: number) => ({
    id: i + 1,
    title: m.title,
    status: m.status || 'locked',
    topics: m.topics?.map((t: any, ti: number) => ({
      id: `${i}-${ti}`,
      name: t.name || t.title,
      description: t.description || `Learn about ${t.name || t.title}`,
      resources: t.resources || [],
      estimatedTime: t.estimatedTime || '2 hours'
    })) || []
  })) || []

  const totalTopics = sections.reduce((acc: number, s: any) => acc + s.topics.length, 0)
  const completedCount = completedTopics.length
  const progress = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  return (
    <PageWrapper>
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <Link href="/roadmaps">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Roadmaps
          </button>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${roadmap.gradient} flex items-center justify-center`}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{roadmap.title}</h1>
                  <p className="text-gray-400">{roadmap.description}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{(roadmap.learners / 1000).toFixed(1)}k learners</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{roadmap.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{roadmap.rating} rating</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{totalTopics} topics</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSaveRoadmap}
                disabled={saving}
                className="btn-secondary"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <BookmarkPlus className="w-5 h-5" />
                )}
                Save
              </button>
              <button className="btn-secondary">
                <Share2 className="w-5 h-5" />
                Share
              </button>
              <button onClick={handleStartLearning} className="btn-primary">
                <Play className="w-5 h-5" />
                Start Learning
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {user && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Your Progress</span>
                <span className="text-sm font-semibold">{progress}% Complete</span>
              </div>
              <div className="progress-bar h-3">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </motion.div>

        {/* Roadmap Tree */}
        <div className="space-y-4">
          {sections.map((section: any, index: number) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="card overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className={`roadmap-node w-10 h-10 text-sm ${section.status}`}>
                      {section.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : section.status === 'locked' ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <div className="text-left">
                      <h3 className="font-semibold text-lg">{section.title}</h3>
                      <p className="text-sm text-gray-500">
                        {section.topics.filter((t: any) => t.completed).length} / {section.topics.length} topics
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {section.status === 'current' && (
                      <span className="badge badge-primary text-xs">In Progress</span>
                    )}
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Topics */}
                {expandedSections.includes(section.id) && (
                  <div className="border-t border-white/5 p-5 pt-0">
                    <div className="grid gap-3 mt-4">
                      {section.topics.map((topic: any, topicIndex: number) => {
                        const topicId = topic.id || `${section.id}-${topicIndex}`
                        const isCompleted = completedTopics.includes(topicId)
                        const isExpanded = expandedTopics.includes(topicId)
                        
                        return (
                          <div key={topicId} className="rounded-xl border border-white/10 overflow-hidden">
                            {/* Topic Header */}
                            <div className="flex items-center gap-3 p-4 hover:bg-white/5 transition-all">
                              <button
                                onClick={() => toggleTopic(topicId)}
                                className="flex items-center gap-3 flex-1 text-left"
                              >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                  isCompleted 
                                    ? 'bg-emerald-500' 
                                    : 'border-2 border-gray-600'
                                }`}>
                                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>
                                <span className={`font-medium ${
                                  isCompleted ? 'text-gray-400 line-through' : 'text-white'
                                }`}>
                                  {topic.name}
                                </span>
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => markTopicComplete(topicId, section.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
                                  isCompleted
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                              >
                                {isCompleted ? (
                                  <span className="flex items-center gap-1">
                                    <Check className="w-4 h-4" /> Completed
                                  </span>
                                ) : (
                                  'Mark Complete'
                                )}
                              </button>
                            </div>
                            
                            {/* Topic Details (Expanded) */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="border-t border-white/5 bg-white/5"
                                >
                                  <div className="p-4 space-y-3">
                                    {/* Description */}
                                    {topic.description && (
                                      <div>
                                        <h4 className="text-sm font-semibold text-gray-400 mb-1">📖 What you'll learn:</h4>
                                        <p className="text-sm text-gray-300">{topic.description}</p>
                                      </div>
                                    )}
                                    
                                    {/* Estimated Time */}
                                    {topic.estimatedTime && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-300">Estimated time: {topic.estimatedTime}</span>
                                      </div>
                                    )}
                                    
                                    {/* Resources */}
                                    {topic.resources && topic.resources.length > 0 && (
                                      <div>
                                        <h4 className="text-sm font-semibold text-gray-400 mb-2">📚 Resources:</h4>
                                        <ul className="space-y-1">
                                          {topic.resources.map((resource: string, ri: number) => (
                                            <li key={ri} className="text-sm text-gray-300 flex items-start gap-2">
                                              <span className="text-blue-400 mt-0.5">•</span>
                                              <span>{resource}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-2">
                                      <Link 
                                        href={`/learn/${topicId}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
                                      >
                                        <Play className="w-4 h-4" />
                                        Start Learning
                                      </Link>
                                      <Link
                                        href={`/resources?topic=${encodeURIComponent(topic.name)}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all"
                                      >
                                        <BookOpen className="w-4 h-4" />
                                        Get Notes
                                      </Link>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {index < sections.length - 1 && (
                <div className="flex justify-start ml-9 py-1">
                  <div className={`w-0.5 h-8 ${
                    section.status === 'completed' ? 'bg-emerald-500' : 'bg-gray-700'
                  }`} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </PageWrapper>
  )
}
