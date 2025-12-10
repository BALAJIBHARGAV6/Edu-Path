'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Code2, Sparkles, CheckCircle2, Clock, ChevronRight, 
  Play, Lightbulb, RotateCcw, Send, TrendingUp, Filter
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/lib/store'
import PageWrapper from '@/components/PageWrapper'
import GradientText from '@/components/GradientText'

const PRIMARY = '#2563EB'

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
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [code, setCode] = useState(`function solution() {\n  // Your code here\n  \n}`)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  // Get user's selected skills (you can get this from user profile/settings)
  const userSkills = ['JavaScript', 'React', 'CSS'] // This should come from user settings

  // Get relevant problems based on user skills
  const getRecommendedProblems = () => {
    let problems: any[] = []
    
    // If user has selected skills, prioritize those
    if (userSkills.length > 0) {
      userSkills.forEach(skill => {
        if (problemLibrary[skill]) {
          problems = [...problems, ...problemLibrary[skill]]
        }
      })
    }
    
    // Add general problems if we don't have enough
    if (problems.length < 6) {
      problems = [...problems, ...problemLibrary['General']]
    }
    
    // Remove duplicates
    return Array.from(new Map(problems.map(p => [p.id, p])).values())
  }

  const allProblems = getRecommendedProblems()
  const topics = ['all', ...Object.keys(problemLibrary)]
  
  const filteredProblems = allProblems.filter(p => {
    const matchesDifficulty = filter === 'all' || p.difficulty === filter
    const matchesTopic = selectedTopic === 'all' || 
      Object.entries(problemLibrary).some(([topic, probs]) => 
        topic === selectedTopic && probs.some(prob => prob.id === p.id)
      )
    return matchesDifficulty && matchesTopic
  })

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

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  return (
    <PageWrapper>
      <div className="min-h-screen pt-16 sm:pt-20 md:pt-24" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedProblem ? (
          /* Problem Solving View */
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
              {/* Left - Problem Description */}
              <div className="flex flex-col">
                <div className="mb-4">
                  <button 
                    onClick={() => setSelectedProblem(null)}
                    className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
                    style={{ color: accent }}
                  >
                    ← Back to Problems
                  </button>
                </div>
                
                <div className="flex-1 p-6 rounded-2xl overflow-y-auto" style={{ background: subtle, border: '1px solid ' + border }}>
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-2xl font-bold" style={{ color: text }}>{selectedProblem.title}</h1>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        background: difficultyColors[selectedProblem.difficulty].bg,
                        color: difficultyColors[selectedProblem.difficulty].text
                      }}
                    >
                      {selectedProblem.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-base mb-6 leading-relaxed" style={{ color: muted }}>
                    {selectedProblem.desc}
                  </p>
                  
                  <div className="p-4 rounded-xl mb-6" style={{ background: accent + '10', border: '1px solid ' + accent + '30' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4" style={{ color: accent }} />
                      <span className="font-semibold text-sm" style={{ color: accent }}>Example</span>
                    </div>
                    <div className="space-y-2 text-sm" style={{ color: muted }}>
                      <div><strong>Input:</strong> [2,7,11,15], target = 9</div>
                      <div><strong>Output:</strong> [0,1]</div>
                      <div><strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm" style={{ color: muted }}>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} />
                      {selectedProblem.acceptance}% Acceptance
                    </span>
                    <span>{selectedProblem.category}</span>
                  </div>
                </div>
              </div>

              {/* Right - Code Editor */}
              <div className="flex flex-col">
                {/* Editor Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-2xl p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-gray-300 text-sm font-medium">solution.js</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <select className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-sm border border-gray-600 outline-none focus:border-blue-500">
                        <option>JavaScript</option>
                        <option>Python</option>
                        <option>Java</option>
                        <option>C++</option>
                      </select>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCode(`function solution() {\n  // Your code here\n  \n}`)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <RotateCcw className="w-4 h-4 text-gray-300" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Code Editor Area */}
                <div className="flex-1 bg-gray-900 relative">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full p-6 font-mono text-sm resize-none outline-none bg-transparent text-gray-100"
                    style={{ 
                      lineHeight: '1.6',
                      fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace'
                    }}
                    spellCheck={false}
                    placeholder="// Write your solution here..."
                  />
                  {/* Line numbers simulation */}
                  <div className="absolute left-2 top-6 text-gray-500 text-sm font-mono pointer-events-none">
                    {code.split('\n').map((_, i) => (
                      <div key={i} className="h-6 leading-6">{i + 1}</div>
                    ))}
                  </div>
                </div>
                
                {/* Output Area */}
                {output && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="bg-gray-800 border-t border-gray-700 p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <h3 className="text-sm font-semibold text-gray-200">Console Output</h3>
                    </div>
                    <pre className="text-sm font-mono text-green-400 bg-gray-900 p-3 rounded-lg">
                      {output}
                    </pre>
                  </motion.div>
                )}
                
                {/* Action Bar */}
                <div className="bg-white dark:bg-gray-900 rounded-b-2xl p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={runCode}
                        disabled={running}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
                      >
                        {running ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Run Code
                          </>
                        )}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markComplete(selectedProblem.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all shadow-lg"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Submit
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Ctrl</kbd>
                        +
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Enter</kbd>
                        to run
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Problems List View */
          <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}
            >
              <Code2 className="w-4 h-4" style={{ color: accent }} />
              <span className="text-sm font-medium" style={{ color: accent }}>Practice Problems</span>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6" style={{ color: text }}>
              Master coding with <GradientText>practice</GradientText>
            </h1>
            <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: muted }}>
              Solve coding problems to improve your skills and land your dream job
            </p>
          </motion.div>

          {/* User Skills Banner */}
          {userSkills.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mb-8 p-4 rounded-xl flex items-center gap-3"
              style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: accent }} />
              <div>
                <p className="text-sm font-medium" style={{ color: accent }}>Personalized for your skills</p>
                <p className="text-xs" style={{ color: muted }}>
                  Showing problems for: {userSkills.join(', ')}
                </p>
              </div>
            </motion.div>
          )}

          {/* Topic Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: text }}>Topics</h3>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: selectedTopic === topic ? accent : subtle,
                    color: selectedTopic === topic ? '#fff' : muted,
                    border: '1px solid ' + border
                  }}
                >
                  {topic === 'all' ? 'All Topics' : topic}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Difficulty Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <h3 className="text-sm font-semibold mb-3" style={{ color: text }}>Difficulty</h3>
            <div className="flex items-center gap-2">
              {(['all', 'easy', 'medium', 'hard'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ 
                    background: filter === f ? (f === 'all' ? accent : difficultyColors[f]?.bg || accent) : subtle,
                    color: filter === f ? (f === 'all' ? '#fff' : difficultyColors[f]?.text || '#fff') : muted,
                    border: '1px solid ' + border
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Problems Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProblems.map((problem, i) => (
              <motion.div 
                key={problem.id} 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 * i, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700"
                onClick={() => setSelectedProblem(problem)}
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Code2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                        problem.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {problem.title}
                  </h3>
                  <p className="text-sm mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
                    {problem.desc}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg">
                        {problem.category}
                      </span>
                      <span className="text-xs flex items-center gap-1 text-gray-500 dark:text-gray-400">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        {problem.acceptance}%
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:text-blue-500 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          </div>
        )}
        </div>
      </div>
    </PageWrapper>
  )
}
