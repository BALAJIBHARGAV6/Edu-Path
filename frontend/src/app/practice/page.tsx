'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { 
  Code2, Sparkles, CheckCircle2, Clock, ChevronRight, 
  Play, Lightbulb, RotateCcw, Send, TrendingUp, Filter, Loader2, Terminal
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/lib/store'
import PageWrapper from '@/components/PageWrapper'
import GradientText from '@/components/GradientText'
import toast from 'react-hot-toast'

// Dynamically import Monaco Editor (client-side only)
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const PRIMARY = '#2563EB'

const difficultyColors: Record<string, { bg: string; text: string }> = {
  easy: { bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
  medium: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  hard: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
}

export default function PracticePage() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { currentRoadmap } = useStore()
  const router = useRouter()
  const isDark = theme === 'dark'
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [selectedProblem, setSelectedProblem] = useState<any | null>(null)
  const [completedProblems, setCompletedProblems] = useState<number[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string>('JavaScript')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript')
  const [code, setCode] = useState(`function solution(nums, target) {
  // Write your solution here
  
  return [];
}`)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [challenges, setChallenges] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [careerGoal, setCareerGoal] = useState<string>('')

  // Fetch user profile to get career goal
  useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${user.id}`)
        const data = await response.json()
        if (data.success && data.profile) {
          setUserProfile(data.profile)
          setCareerGoal(data.profile.career_goal || '')
        }
      }
    }
    fetchUserProfile()
    
    // Listen for skills updates from settings page
    const handleSkillsUpdate = () => {
      fetchUserProfile()
    }
    window.addEventListener('skillsUpdated', handleSkillsUpdate)
    return () => window.removeEventListener('skillsUpdated', handleSkillsUpdate)
  }, [user])

  // Get career-specific topics
  const getCareerTopics = (career: string): string[] => {
    const careerMap: Record<string, string[]> = {
      'Frontend Developer': ['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML', 'Algorithms'],
      'Backend Developer': ['Node.js', 'Python', 'Java', 'Algorithms', 'Database', 'APIs'],
      'Full Stack Developer': ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Algorithms', 'Database'],
      'Mobile Developer': ['JavaScript', 'React Native', 'Flutter', 'Algorithms', 'UI/UX'],
      'DevOps Engineer': ['Python', 'Bash', 'Docker', 'Kubernetes', 'Cloud', 'Algorithms'],
      'Data Scientist': ['Python', 'Algorithms', 'Statistics', 'Machine Learning', 'Data Structures']
    }
    return careerMap[career] || ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'Algorithms']
  }

  // Get user's actual skills from profile - ONLY use these, no fallback
  const userActualSkills = Array.isArray(userProfile?.skills) && userProfile.skills.length > 0 
    ? userProfile.skills 
    : []
  const topics = userActualSkills

  // Only fetch challenges if user has skills
  const shouldFetchChallenges = userActualSkills.length > 0

  // Cache challenges to avoid refetching
  const [challengeCache, setChallengeCache] = useState<Record<string, any[]>>({})
  const [submitted, setSubmitted] = useState(false)

  const fetchChallenges = async (category: string = 'JavaScript', difficulty: string = 'all') => {
    const cacheKey = `${category}-${difficulty}`
    
    // Use cached data if available
    if (challengeCache[cacheKey]) {
      setChallenges(challengeCache[cacheKey])
      return
    }
    
    setLoading(true)
    try {
      const params = new URLSearchParams({
        category,
        difficulty: difficulty === 'all' ? 'mixed' : difficulty,
        count: '6'
      })
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/practice/challenges?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setChallenges(data.challenges)
        setChallengeCache(prev => ({ ...prev, [cacheKey]: data.challenges }))
      } else {
        toast.error('Failed to load challenges')
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
      toast.error('Failed to load challenges')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (shouldFetchChallenges) {
      fetchChallenges(selectedTopic, filter)
    } else {
      setChallenges([])
      setLoading(false)
    }
  }, [selectedTopic, filter, shouldFetchChallenges])
  
  const filteredProblems = challenges

  const runCode = async () => {
    if (!selectedProblem) {
      toast.error('No problem selected')
      return
    }
    
    setRunning(true)
    setOutput(null)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/practice/submit-solution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'anonymous',
          challengeId: selectedProblem.id,
          code,
          language: selectedLanguage
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        const evaluation = data.evaluation
        setOutput(`${evaluation.passed ? '✅ PASSED' : '❌ FAILED'} - Score: ${evaluation.score}/100\n\n📝 Feedback:\n${evaluation.feedback}\n\n🧪 Tests: ${evaluation.testsPassed}/${evaluation.testsTotal} passed\n\n✅ Strengths:\n${evaluation.strengths?.map((s: string) => `  • ${s}`).join('\n') || 'N/A'}\n\n⚠️ Improvements:\n${evaluation.improvements?.map((i: string) => `  • ${i}`).join('\n') || 'N/A'}\n\n⚡ Complexity: ${evaluation.efficiency || 'N/A'}`)
        
        setSubmitted(true)
        if (evaluation.passed) {
          markComplete(selectedProblem.id)
          toast.success('🎉 Solution passed!')
        } else {
          toast.error('Solution needs improvement')
        }
      } else {
        setOutput(`Error: ${data.error || 'Failed to evaluate solution'}`)
        toast.error('Evaluation failed')
      }
    } catch (error) {
      console.error('Error submitting solution:', error)
      setOutput('❌ Error evaluating solution. Please check if the backend server is running.')
      toast.error('Failed to connect to server')
    } finally {
      setRunning(false)
    }
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
          
          {/* Empty State - No Skills Added */}
          {!shouldFetchChallenges && !loading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="p-6 rounded-full mb-6" style={{ background: accent + '15' }}>
                <Code2 className="w-16 h-16" style={{ color: accent }} />
              </div>
              <h2 className="text-3xl font-bold mb-3" style={{ color: text }}>
                No Skills Added Yet
              </h2>
              <p className="text-lg mb-8 max-w-md" style={{ color: muted }}>
                Add your skills in Settings to get personalized coding challenges tailored to your learning path.
              </p>
              <button
                onClick={() => router.push('/settings')}
                className="px-8 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${accent} 0%, #7C3AED 100%)` }}
              >
                Go to Settings
              </button>
            </div>
          )}

          {shouldFetchChallenges && selectedProblem ? (
            // Problem Solving View
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
                {/* Left - Problem Description */}
                <div className="flex flex-col">
                <div className="mb-4">
                  <button 
                    type="button"
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
                <div className="rounded-t-2xl p-4 border-b flex items-center justify-between"
                  style={{ 
                    background: isDark ? '#1E1E1E' : '#F3F4F6',
                    borderColor: border
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium" style={{ color: text }}>
                      solution.{selectedLanguage === 'javascript' ? 'js' : selectedLanguage === 'python' ? 'py' : selectedLanguage === 'typescript' ? 'ts' : 'java'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-sm border outline-none transition-colors"
                      style={{
                        background: subtle,
                        color: text,
                        borderColor: border
                      }}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCode(`function solution(nums, target) {\n  // Write your solution here\n  \n  return [];\n}`)}
                      className="p-2 rounded-lg transition-colors hover:opacity-80"
                      style={{ background: subtle }}
                    >
                      <RotateCcw className="w-4 h-4" style={{ color: muted }} />
                    </motion.button>
                  </div>
                </div>
                
                {/* Monaco Code Editor */}
                <div className="flex-1 min-h-[400px] border-b" style={{ borderColor: border }}>
                  <Editor
                    height="100%"
                    language={selectedLanguage}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme={isDark ? 'vs-dark' : 'light'}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: true,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: 'on',
                      padding: { top: 16, bottom: 16 },
                      suggestOnTriggerCharacters: true,
                      quickSuggestions: true,
                      folding: true,
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                    }}
                    loading={
                      <div className="flex items-center justify-center h-full" style={{ background: isDark ? '#1E1E1E' : '#FFFFFF' }}>
                        <Loader2 className="w-6 h-6 animate-spin" style={{ color: accent }} />
                      </div>
                    }
                  />
                </div>
                
                {/* Output Area */}
                {output && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="p-4 border-t"
                    style={{ 
                      background: isDark ? '#1E1E1E' : '#F9FAFB',
                      borderColor: border
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4" style={{ color: accent }} />
                        <h3 className="text-sm font-semibold" style={{ color: text }}>Console Output</h3>
                      </div>
                      {submitted && (
                        <motion.button
                          type="button"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedProblem(null)
                            setOutput(null)
                            setSubmitted(false)
                            setCode(`function solution(nums, target) {\n  // Write your solution here\n  \n  return [];\n}`)
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all"
                          style={{ background: accent, color: '#FFFFFF' }}
                        >
                          <ChevronRight className="w-4 h-4" />
                          Next Problem
                        </motion.button>
                      )}
                    </div>
                    <pre className="text-sm font-mono whitespace-pre-wrap p-3 rounded-lg max-h-48 overflow-y-auto" 
                      style={{ 
                        background: isDark ? '#252526' : '#FFFFFF',
                        color: output.includes('PASSED') ? '#10B981' : output.includes('FAILED') ? '#EF4444' : text,
                        border: `1px solid ${border}`
                      }}>
                      {output}
                    </pre>
                  </motion.div>
                )}
                
                {/* Action Bar */}
                <div className="rounded-b-2xl p-4 border-t flex items-center justify-between"
                  style={{ background: subtle, borderColor: border }}>
                  <div className="text-xs" style={{ color: muted }}>
                    <kbd className="px-2 py-1 rounded" style={{ background: isDark ? '#2D2D2D' : '#E5E7EB' }}>Ctrl</kbd>
                    {' + '}
                    <kbd className="px-2 py-1 rounded" style={{ background: isDark ? '#2D2D2D' : '#E5E7EB' }}>Enter</kbd>
                    {' '}to run
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        runCode()
                      }}
                      disabled={running}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
                      style={{ background: accent, color: '#FFFFFF' }}
                    >
                      {running ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
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
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        runCode()
                      }}
                      disabled={running}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50"
                      style={{ background: '#10B981', color: '#FFFFFF' }}
                    >
                      <Send className="w-4 h-4" />
                      Submit
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
          {/* Problems List View */}
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
          {userActualSkills.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mb-8 p-4 rounded-xl flex items-center gap-3"
              style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: accent }} />
              <div>
                <p className="text-sm font-medium" style={{ color: accent }}>Personalized for your skills</p>
                <p className="text-xs" style={{ color: muted }}>
                  Showing problems for: {userActualSkills.join(', ')}
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
            {loading ? (
              // Loading skeletons
              [...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-64 rounded-2xl" />
              ))
            ) : (
              filteredProblems.map((problem, i) => (
                <motion.div 
                  key={problem.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden border border-gray-200 dark:border-gray-700 will-change-transform"
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
            ))
            )}
          </div>
          </div>
          </>
        )}
        </div>
      </div>
    </PageWrapper>
  )
}

