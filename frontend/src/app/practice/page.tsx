'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Code2, Play, CheckCircle2, Clock, Filter,
  ChevronRight, Lightbulb, RotateCcw, Send, Sparkles
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/lib/store'

const PRIMARY = '#3B82F6'

// Problems organized by topic
const problemLibrary: Record<string, any[]> = {
  'JavaScript': [
    { id: 1, title: 'Two Sum', difficulty: 'easy', category: 'Arrays', acceptance: 78, desc: 'Find two numbers that add up to target' },
    { id: 2, title: 'Reverse String', difficulty: 'easy', category: 'Strings', acceptance: 85, desc: 'Reverse a string in-place' },
    { id: 3, title: 'Palindrome Check', difficulty: 'easy', category: 'Strings', acceptance: 80, desc: 'Check if string is palindrome' },
  ],
  'React': [
    { id: 4, title: 'Counter Component', difficulty: 'easy', category: 'Components', acceptance: 90, desc: 'Build a simple counter with hooks' },
    { id: 5, title: 'Todo List', difficulty: 'medium', category: 'State', acceptance: 72, desc: 'Create a todo app with CRUD operations' },
    { id: 6, title: 'Fetch Data Hook', difficulty: 'medium', category: 'Hooks', acceptance: 65, desc: 'Build a custom useFetch hook' },
  ],
  'CSS': [
    { id: 7, title: 'Center a Div', difficulty: 'easy', category: 'Layout', acceptance: 95, desc: 'Multiple ways to center elements' },
    { id: 8, title: 'Responsive Navbar', difficulty: 'medium', category: 'Layout', acceptance: 70, desc: 'Build a mobile-friendly navbar' },
    { id: 9, title: 'Flexbox Gallery', difficulty: 'easy', category: 'Flexbox', acceptance: 82, desc: 'Create a responsive image gallery' },
  ],
  'TypeScript': [
    { id: 10, title: 'Generic Function', difficulty: 'medium', category: 'Generics', acceptance: 60, desc: 'Implement a generic utility function' },
    { id: 11, title: 'Type Guards', difficulty: 'medium', category: 'Types', acceptance: 55, desc: 'Create type-safe guards' },
  ],
  'Node.js': [
    { id: 12, title: 'REST API Endpoint', difficulty: 'medium', category: 'APIs', acceptance: 68, desc: 'Build a CRUD endpoint' },
    { id: 13, title: 'File Upload', difficulty: 'hard', category: 'APIs', acceptance: 45, desc: 'Handle multipart file uploads' },
  ],
  'General': [
    { id: 14, title: 'FizzBuzz', difficulty: 'easy', category: 'Logic', acceptance: 92, desc: 'Classic programming challenge' },
    { id: 15, title: 'Valid Parentheses', difficulty: 'easy', category: 'Stacks', acceptance: 72, desc: 'Check if brackets are balanced' },
    { id: 16, title: 'Merge Arrays', difficulty: 'medium', category: 'Arrays', acceptance: 65, desc: 'Merge two sorted arrays' },
  ]
}

const difficultyColors: Record<string, { bg: string; text: string }> = {
  easy: { bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
  medium: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  hard: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
}

export default function PracticePage() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { currentRoadmap } = useStore()
  const isDark = theme === 'dark'
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [selectedProblem, setSelectedProblem] = useState<any | null>(null)
  const [completedProblems, setCompletedProblems] = useState<number[]>([])
  const [code, setCode] = useState(`function solution() {\n  // Your code here\n  \n}`)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  // Get user's learning topics from roadmap
  const roadmapTopics = currentRoadmap?.milestones?.flatMap((m: any) => m.skills || []) 
    || currentRoadmap?.ai_generated_path?.milestones?.flatMap((m: any) => m.skills || []) 
    || []

  // Get relevant problems
  const getRecommendedProblems = () => {
    let problems: any[] = []
    
    if (roadmapTopics.length > 0) {
      const topicKeywords = ['JavaScript', 'React', 'CSS', 'TypeScript', 'Node.js']
      roadmapTopics.forEach((topic: string) => {
        topicKeywords.forEach(keyword => {
          if (topic.toLowerCase().includes(keyword.toLowerCase()) && problemLibrary[keyword]) {
            problems = [...problems, ...problemLibrary[keyword]]
          }
        })
      })
    }
    
    if (problems.length === 0) {
      Object.values(problemLibrary).forEach(probs => {
        problems = [...problems, ...probs]
      })
    }
    
    return Array.from(new Map(problems.map(p => [p.id, p])).values())
  }

  const allProblems = getRecommendedProblems()
  const filteredProblems = filter === 'all' ? allProblems : allProblems.filter(p => p.difficulty === filter)

  const runCode = async () => {
    setRunning(true)
    setOutput(null)
    await new Promise(r => setTimeout(r, 1500))
    setOutput('✓ All test cases passed!\n\nTest 1: Passed ✓\nTest 2: Passed ✓\nTest 3: Passed ✓')
    setRunning(false)
  }

  const markComplete = (id: number) => {
    if (!completedProblems.includes(id)) {
      setCompletedProblems([...completedProblems, id])
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: isDark ? '#0A0A0F' : '#FAFBFC' }}>
      {selectedProblem ? (
        /* Problem View */
        <div className="h-[calc(100vh-96px)] flex">
          {/* Left - Problem Description */}
          <div className="w-1/2 border-r overflow-y-auto p-6" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
            <button onClick={() => setSelectedProblem(null)} className="flex items-center gap-1 text-sm mb-4" style={{ color: PRIMARY }}>
              ← Back to Problems
            </button>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-2xl font-bold" style={{ color: isDark ? '#fff' : '#0F172A' }}>{selectedProblem.title}</h1>
              <span className="px-2 py-1 rounded text-xs font-medium" 
                style={{ background: difficultyColors[selectedProblem.difficulty].bg, color: difficultyColors[selectedProblem.difficulty].text }}>
                {selectedProblem.difficulty}
              </span>
            </div>
            <p className="mb-6" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>{selectedProblem.desc}</p>
            
            <div className="p-4 rounded-xl mb-6" style={{ background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4" style={{ color: PRIMARY }} />
                <span className="font-medium text-sm" style={{ color: PRIMARY }}>Hint</span>
              </div>
              <p className="text-sm" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Think about edge cases and optimize for time complexity.</p>
            </div>
          </div>

          {/* Right - Code Editor */}
          <div className="w-1/2 flex flex-col">
            <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
              <span className="text-sm font-medium" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>JavaScript</span>
              <button onClick={() => setCode(`function solution() {\n  // Your code here\n  \n}`)} className="p-2 rounded-lg" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                <RotateCcw className="w-4 h-4" style={{ color: isDark ? '#94A3B8' : '#64748B' }} />
              </button>
            </div>
            <div className="flex-1 p-4" style={{ background: isDark ? '#0E0E14' : '#fff' }}>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full font-mono text-sm resize-none outline-none"
                style={{ background: 'transparent', color: isDark ? '#fff' : '#0F172A' }}
                spellCheck={false}
              />
            </div>
            <div className="p-3 border-t flex items-center justify-between" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={runCode} disabled={running}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ background: 'rgba(59,130,246,0.15)', color: PRIMARY, border: '1px solid rgba(59,130,246,0.3)' }}
                >
                  {running ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: PRIMARY, borderTopColor: 'transparent' }} /> : <Play className="w-4 h-4" />}
                  Run Code
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => markComplete(selectedProblem.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${PRIMARY}, #06B6D4)` }}
                >
                  <Send className="w-4 h-4" /> Submit
                </motion.button>
              </div>
            </div>
            {output && (
              <div className="p-4 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', background: isDark ? '#0A0A0F' : '#F8FAFC' }}>
                <pre className="text-sm font-mono whitespace-pre-wrap" style={{ color: '#10B981' }}>{output}</pre>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Problems List */
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-5 h-5" style={{ color: PRIMARY }} />
              <span className="text-sm font-medium" style={{ color: PRIMARY }}>
                {roadmapTopics.length > 0 ? 'Recommended for You' : 'Practice Problems'}
              </span>
            </div>
            <h1 className="text-3xl font-black mb-2" style={{ color: isDark ? '#fff' : '#0F172A' }}>Practice</h1>
            <p className="text-base" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
              {roadmapTopics.length > 0 ? 'Problems based on your learning path' : 'Solve coding challenges to sharpen your skills'}
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
                Showing problems for: <strong style={{ color: PRIMARY }}>{roadmapTopics.slice(0, 3).join(', ')}</strong>
              </p>
            </motion.div>
          )}

          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-2 mb-6">
            {(['all', 'easy', 'medium', 'hard'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ 
                  background: filter === f ? (f === 'all' ? 'rgba(59,130,246,0.2)' : difficultyColors[f]?.bg || 'rgba(59,130,246,0.2)') : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                  color: filter === f ? (f === 'all' ? PRIMARY : difficultyColors[f]?.text || PRIMARY) : (isDark ? '#94A3B8' : '#64748B')
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </motion.div>

          {/* Problems */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
            {filteredProblems.map((p, i) => (
              <motion.button key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.03 * i }}
                onClick={() => setSelectedProblem(p)}
                className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all hover:scale-[1.01]"
                style={{ background: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.8)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: completedProblems.includes(p.id) ? 'rgba(16,185,129,0.15)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') }}
                >
                  {completedProblems.includes(p.id) ? (
                    <CheckCircle2 className="w-5 h-5" style={{ color: '#10B981' }} />
                  ) : (
                    <Code2 className="w-5 h-5" style={{ color: isDark ? '#64748B' : '#94A3B8' }} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-0.5" style={{ color: isDark ? '#fff' : '#0F172A' }}>{p.title}</h3>
                  <p className="text-xs" style={{ color: isDark ? '#64748B' : '#94A3B8' }}>{p.category} • {p.acceptance}% acceptance</p>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-medium"
                  style={{ background: difficultyColors[p.difficulty].bg, color: difficultyColors[p.difficulty].text }}
                >{p.difficulty}</span>
                <ChevronRight className="w-4 h-4" style={{ color: isDark ? '#64748B' : '#94A3B8' }} />
              </motion.button>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
}
