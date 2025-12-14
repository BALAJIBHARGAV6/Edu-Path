'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, Sparkles, Search, Download, RefreshCw,
  BookOpen, Clock, ChevronRight, Loader2, Copy, Check
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/lib/store'
import PageWrapper from '@/components/PageWrapper'
import GradientText from '@/components/GradientText'
import toast from 'react-hot-toast'

const PRIMARY = '#3B82F6'

export default function ResourcesPage() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { currentRoadmap } = useStore()
  const isDark = theme === 'dark'
  const [search, setSearch] = useState('')
  const [generating, setGenerating] = useState<number | null>(null)
  const [generatedNotes, setGeneratedNotes] = useState<Record<number, string>>({})
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)
  const [topics, setTopics] = useState<any[]>([])
  const [loadingTopics, setLoadingTopics] = useState(true)

  // Extract topics from user's roadmap
  useEffect(() => {
    if (currentRoadmap) {
      const milestones = currentRoadmap.milestones || currentRoadmap.ai_generated_path?.milestones || []
      const extractedTopics: any[] = []
      
      milestones.forEach((milestone: any, mIndex: number) => {
        const milestoneTopics = milestone.topics || []
        milestoneTopics.forEach((topic: any, tIndex: number) => {
          extractedTopics.push({
            id: mIndex * 100 + tIndex,
            title: topic.name || topic.title,
            category: milestone.title || 'General',
            description: topic.description || ''
          })
        })
      })
      
      setTopics(extractedTopics.slice(0, 20)) // Limit to 20 topics
    }
    setLoadingTopics(false)
  }, [currentRoadmap])

  const filteredTopics = topics.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  const generateNotes = async (topic: any) => {
    setGenerating(topic.id)
    setSelectedTopic(topic)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resources/generate-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: topic.title,
          level: 'intermediate',
          format: 'detailed'
        })
      })
      
      const data = await response.json()
      
      if (data.notes) {
        setGeneratedNotes(prev => ({ ...prev, [topic.id]: data.notes }))
        toast.success('Notes generated with AI!')
      } else {
        throw new Error('Failed to generate notes')
      }
    } catch (error) {
      console.error('Error generating notes:', error)
      toast.error('Failed to generate notes. Please try again.')
    } finally {
      setGenerating(null)
    }
  }

  const copyNotes = () => {
    if (selectedTopic && generatedNotes[selectedTopic.id]) {
      navigator.clipboard.writeText(generatedNotes[selectedTopic.id])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Copied to clipboard!')
    }
  }

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  // Show message if no roadmap
  if (!currentRoadmap && !loadingTopics) {
    return (
      <PageWrapper>
        <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 flex items-center justify-center" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
          <div className="text-center max-w-lg px-4">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto"
            >
              <FileText className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: text }}>Generate Your Roadmap First</h2>
            <p className="text-base mb-6" style={{ color: muted }}>
              Create a personalized roadmap to get AI-powered study notes for your learning topics.
            </p>
            <a href="/roadmaps" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
              Generate Roadmap
            </a>
          </div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="min-h-screen pt-16 sm:pt-20 md:pt-24" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
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
            <span className="text-sm font-medium" style={{ color: accent }}>AI-Powered Study Notes</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ color: text }}>
            Master concepts with <GradientText>smart resources</GradientText>
          </h1>
          
          <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-8" style={{ color: muted }}>
            Generate AI-powered study notes for topics in your learning path. Get comprehensive explanations, examples, and best practices.
          </p>
        </motion.div>

        {/* Topics Count Banner */}
        {topics.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">Your Learning Topics</h3>
                <p className="text-blue-100 text-xs sm:text-sm">
                  {topics.length} topics from your roadmap ready for AI notes
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Topics Sidebar */}
          <div className="lg:col-span-1">
            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-blue-500" style={{ color: muted }} />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all border-0 focus:ring-2 focus:ring-blue-500/30 focus:scale-[1.02]"
                  style={{ 
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    color: text
                  }}
                />
              </div>
            </motion.div>

            {/* Topics List */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-1">
              <h3 className="text-xs uppercase tracking-wider font-bold mb-3 opacity-60" style={{ color: text }}>Topics</h3>
              {filteredTopics.map((topic, i) => (
                <motion.button
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i }}
                  onClick={() => generatedNotes[topic.id] ? setSelectedTopic(topic) : generateNotes(topic)}
                  disabled={generating === topic.id}
                  className="w-full group flex items-center gap-3 p-3 rounded-lg text-left transition-all hover:translate-x-1"
                  style={{ 
                    background: selectedTopic?.id === topic.id ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)' : 'transparent',
                    color: selectedTopic?.id === topic.id ? '#fff' : text
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all" 
                    style={{ 
                      background: selectedTopic?.id === topic.id ? 'rgba(255,255,255,0.2)' : (isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)'),
                    }}
                  >
                    {generating === topic.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: selectedTopic?.id === topic.id ? '#fff' : '#3B82F6' }} />
                    ) : (
                      <FileText className="w-4 h-4" style={{ color: selectedTopic?.id === topic.id ? '#fff' : '#3B82F6' }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {topic.title}
                    </p>
                    <p className="text-xs opacity-70">{topic.category}</p>
                  </div>
                  {generatedNotes[topic.id] && (
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            {selectedTopic && generatedNotes[selectedTopic.id] ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{selectedTopic.title}</h2>
                        <p className="text-blue-100 text-sm">AI-generated study notes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={copyNotes} 
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4 text-white" />}
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => generateNotes(selectedTopic)} 
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                      >
                        <RefreshCw className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4 sm:p-6 max-h-[500px] overflow-y-auto">
                  <div className="prose prose-sm sm:prose prose-gray dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed" style={{ color: text }}>
                      {generatedNotes[selectedTopic.id]}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 min-h-[400px] flex flex-col items-center justify-center text-center p-6 sm:p-8">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg"
                >
                  <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3" style={{ color: text }}>Select a Topic</h3>
                <p className="text-sm sm:text-base max-w-md leading-relaxed opacity-70" style={{ color: muted }}>
                  Choose any topic from your roadmap to generate AI-powered study notes instantly.
                </p>
              </div>
            )}
          </motion.div>
        </div>
        </div>
      </div>
    </PageWrapper>
  )
}
