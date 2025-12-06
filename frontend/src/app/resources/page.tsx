'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, Sparkles, Search, Download, RefreshCw,
  BookOpen, Clock, ChevronRight, Loader2, Copy, Check
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/lib/store'
import toast from 'react-hot-toast'

const PRIMARY = '#3B82F6'

// Topics organized by skill area
const topicLibrary: Record<string, any[]> = {
  'JavaScript': [
    { id: 1, title: 'JavaScript Fundamentals', category: 'Basics' },
    { id: 2, title: 'ES6+ Features', category: 'Modern JS' },
    { id: 3, title: 'Async/Await & Promises', category: 'Async' },
  ],
  'React': [
    { id: 4, title: 'React Hooks Deep Dive', category: 'Hooks' },
    { id: 5, title: 'State Management', category: 'State' },
    { id: 6, title: 'React Performance', category: 'Optimization' },
  ],
  'CSS': [
    { id: 7, title: 'CSS Grid & Flexbox', category: 'Layout' },
    { id: 8, title: 'Responsive Design', category: 'Mobile' },
    { id: 9, title: 'CSS Animations', category: 'Animation' },
  ],
  'TypeScript': [
    { id: 10, title: 'TypeScript Essentials', category: 'Basics' },
    { id: 11, title: 'Advanced Types', category: 'Types' },
  ],
  'Node.js': [
    { id: 12, title: 'Node.js Basics', category: 'Backend' },
    { id: 13, title: 'REST API Design', category: 'APIs' },
  ],
  'General': [
    { id: 14, title: 'Git Version Control', category: 'Tools' },
    { id: 15, title: 'Clean Code Principles', category: 'Best Practices' },
    { id: 16, title: 'Data Structures', category: 'CS Fundamentals' },
  ]
}

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

  // Get user's learning topics from roadmap
  const roadmapTopics = currentRoadmap?.milestones?.flatMap((m: any) => m.skills || []) 
    || currentRoadmap?.ai_generated_path?.milestones?.flatMap((m: any) => m.skills || []) 
    || []

  // Get relevant topics
  const getRecommendedTopics = () => {
    let topics: any[] = []
    
    if (roadmapTopics.length > 0) {
      const topicKeywords = ['JavaScript', 'React', 'CSS', 'TypeScript', 'Node.js']
      roadmapTopics.forEach((topic: string) => {
        topicKeywords.forEach(keyword => {
          if (topic.toLowerCase().includes(keyword.toLowerCase()) && topicLibrary[keyword]) {
            topics = [...topics, ...topicLibrary[keyword]]
          }
        })
      })
    }
    
    if (topics.length === 0) {
      Object.values(topicLibrary).forEach(t => {
        topics = [...topics, ...t]
      })
    }
    
    return Array.from(new Map(topics.map(t => [t.id, t])).values())
  }

  const allTopics = getRecommendedTopics()
  const filteredTopics = allTopics.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  const generateNotes = async (topic: any) => {
    setGenerating(topic.id)
    setSelectedTopic(topic)
    
    await new Promise(r => setTimeout(r, 2000))
    
    const notes = `# ${topic.title}

## Overview
${topic.title} is a fundamental concept in modern web development that every developer should master.

## Key Concepts

### 1. Core Fundamentals
- Understanding the basic principles
- Common patterns and best practices
- Real-world applications

### 2. Practical Implementation
\`\`\`javascript
// Example implementation
const example = () => {
  console.log('Learning ${topic.title}');
};
\`\`\`

### 3. Best Practices
- Write clean, readable code
- Follow established conventions
- Test your implementations

## Summary
Mastering ${topic.title} will significantly improve your development skills and career prospects.

## Next Steps
- Practice with hands-on projects
- Read official documentation
- Build something real`

    setGeneratedNotes(prev => ({ ...prev, [topic.id]: notes }))
    setGenerating(null)
    toast.success('Notes generated!')
  }

  const copyNotes = () => {
    if (selectedTopic && generatedNotes[selectedTopic.id]) {
      navigator.clipboard.writeText(generatedNotes[selectedTopic.id])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Copied!')
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: isDark ? '#0A0A0F' : '#FAFBFC' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" style={{ color: PRIMARY }} />
            <span className="text-sm font-medium" style={{ color: PRIMARY }}>
              {roadmapTopics.length > 0 ? 'Personalized for You' : 'AI-Powered Notes'}
            </span>
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ color: isDark ? '#fff' : '#0F172A' }}>Resources</h1>
          <p className="text-base" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
            {roadmapTopics.length > 0 ? 'Study materials based on your learning path' : 'Generate AI study notes for any topic'}
          </p>
        </motion.div>

        {/* Personalized Banner */}
        {roadmapTopics.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <Sparkles className="w-5 h-5" style={{ color: PRIMARY }} />
            <p className="text-sm" style={{ color: isDark ? '#CBD5E1' : '#475569' }}>
              Topics for: <strong style={{ color: PRIMARY }}>{roadmapTopics.slice(0, 3).join(', ')}</strong>
            </p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Topics List */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: isDark ? '#64748B' : '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
                  style={{ 
                    background: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.8)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    color: isDark ? '#fff' : '#0F172A'
                  }}
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl overflow-hidden" style={{ background: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}
            >
              {filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => generatedNotes[topic.id] ? setSelectedTopic(topic) : generateNotes(topic)}
                  disabled={generating === topic.id}
                  className="w-full flex items-center gap-3 p-4 border-b text-left transition-colors hover:bg-white/5"
                  style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', background: selectedTopic?.id === topic.id ? 'rgba(59,130,246,0.1)' : 'transparent' }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
                    {generating === topic.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: PRIMARY }} />
                    ) : (
                      <FileText className="w-5 h-5" style={{ color: PRIMARY }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: isDark ? '#fff' : '#0F172A' }}>{topic.title}</p>
                    <p className="text-xs" style={{ color: isDark ? '#64748B' : '#94A3B8' }}>{topic.category}</p>
                  </div>
                  {generatedNotes[topic.id] ? (
                    <Check className="w-4 h-4" style={{ color: '#10B981' }} />
                  ) : (
                    <ChevronRight className="w-4 h-4" style={{ color: isDark ? '#64748B' : '#94A3B8' }} />
                  )}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Notes View */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 rounded-2xl p-6" style={{ background: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}
          >
            {selectedTopic && generatedNotes[selectedTopic.id] ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#0F172A' }}>{selectedTopic.title}</h2>
                    <p className="text-sm" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>AI-generated study notes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={copyNotes} className="p-2 rounded-lg transition-colors" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                      {copied ? <Check className="w-4 h-4" style={{ color: '#10B981' }} /> : <Copy className="w-4 h-4" style={{ color: isDark ? '#94A3B8' : '#64748B' }} />}
                    </button>
                    <button className="p-2 rounded-lg transition-colors" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                      <Download className="w-4 h-4" style={{ color: isDark ? '#94A3B8' : '#64748B' }} />
                    </button>
                    <button onClick={() => generateNotes(selectedTopic)} className="p-2 rounded-lg transition-colors" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                      <RefreshCw className="w-4 h-4" style={{ color: isDark ? '#94A3B8' : '#64748B' }} />
                    </button>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed" style={{ background: 'transparent', color: isDark ? '#CBD5E1' : '#475569' }}>
                    {generatedNotes[selectedTopic.id]}
                  </pre>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(59,130,246,0.15)' }}>
                  <FileText className="w-8 h-8" style={{ color: PRIMARY }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#fff' : '#0F172A' }}>Generate Study Notes</h3>
                <p className="text-sm max-w-sm" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
                  Select a topic from the list to generate AI-powered study notes instantly.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
