'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Brain, Clock, CheckCircle2, XCircle, ArrowRight, Loader2, 
  Trophy, Target, TrendingUp, AlertCircle, Sparkles
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useStore } from '@/lib/store'
import { API_URL } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function TestPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { theme } = useTheme()
  const { currentRoadmap } = useStore()
  const isDark = theme === 'dark'

  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [generating, setGenerating] = useState(false)
  const [test, setTest] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(0)

  // Get topics from roadmap
  const roadmapTopics = currentRoadmap?.ai_generated_path?.milestones?.flatMap(
    (m: any) => m.topics.map((t: any) => t.name)
  ) || []

  // Timer
  useEffect(() => {
    if (test && timeLeft > 0 && !showResults) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && test && !showResults) {
      handleSubmit()
    }
  }, [test, timeLeft, showResults])

  const generateTest = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch(`${API_URL}/api/practice/generate-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, questionCount: 5 })
      })
      const data = await response.json()
      
      if (data.test) {
        setTest(data.test)
        setAnswers(new Array(data.test.questions.length).fill(-1))
        setTimeLeft(data.test.questions.length * 60) // 1 min per question
        setCurrentQuestion(0)
        setShowResults(false)
        setResults(null)
      } else {
        throw new Error('Failed to generate test')
      }
    } catch (error) {
      toast.error('Failed to generate test')
    } finally {
      setGenerating(false)
    }
  }

  const selectAnswer = (index: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = index
    setAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/api/practice/evaluate-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answers, 
          questions: test.questions,
          userId: user?.id,
          roadmapId: currentRoadmap?.id
        })
      })
      const data = await response.json()
      setResults(data)
      setShowResults(true)
    } catch (error) {
      toast.error('Failed to evaluate test')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ background: isDark ? '#000' : '#fff', minHeight: '100vh' }} className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {!test ? (
          // Test Setup
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-10">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'var(--neon)', boxShadow: 'var(--glow)' }}
              >
                <Brain className="w-8 h-8 text-black" />
              </div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
                Skill <span className="gradient-text">Assessment</span>
              </h1>
              <p style={{ color: isDark ? '#888' : '#666' }}>
                Test your knowledge and get personalized path adjustments
              </p>
            </div>

            <div className="card p-8 max-w-xl mx-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
                    Topic to Test
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., React Hooks, JavaScript Arrays"
                    className="input"
                  />
                </div>

                {roadmapTopics.length > 0 && (
                  <div>
                    <p className="text-sm mb-2" style={{ color: isDark ? '#888' : '#666' }}>
                      Quick select from your roadmap:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {roadmapTopics.slice(0, 6).map((t: string) => (
                        <button
                          key={t}
                          onClick={() => setTopic(t)}
                          className="px-3 py-1 rounded-lg text-sm transition-all"
                          style={{ 
                            background: topic === t ? 'var(--neon)' : (isDark ? '#1a1a1a' : '#f0f0f0'),
                            color: topic === t ? '#000' : (isDark ? '#888' : '#666')
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
                    Difficulty
                  </label>
                  <div className="flex gap-3">
                    {['easy', 'medium', 'hard'].map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className="flex-1 py-3 rounded-xl border-2 transition-all capitalize font-medium"
                        style={{ 
                          background: difficulty === d ? 'var(--neon)' : (isDark ? '#111' : '#f8f8f8'),
                          borderColor: difficulty === d ? 'var(--neon)' : (isDark ? '#222' : '#eee'),
                          color: difficulty === d ? '#000' : (isDark ? '#888' : '#666')
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generateTest}
                  disabled={generating || !topic.trim()}
                  className="w-full btn btn-primary py-4"
                  style={{ opacity: generating || !topic.trim() ? 0.5 : 1 }}
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Test...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Start Assessment
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : showResults ? (
          // Results
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ 
                background: results.passed ? 'var(--neon)' : 'rgba(255,107,107,0.2)',
                boxShadow: results.passed ? 'var(--glow)' : 'none'
              }}
            >
              {results.passed ? (
                <Trophy className="w-10 h-10 text-black" />
              ) : (
                <AlertCircle className="w-10 h-10" style={{ color: '#FF6B6B' }} />
              )}
            </div>

            <h2 className="text-3xl font-bold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
              {results.passed ? 'Great Job!' : 'Keep Learning!'}
            </h2>
            <p className="mb-8" style={{ color: isDark ? '#888' : '#666' }}>
              {results.feedback}
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
              <div className="card p-4">
                <p className="text-3xl font-bold glow-text">{results.score}%</p>
                <p className="text-sm" style={{ color: isDark ? '#888' : '#666' }}>Score</p>
              </div>
              <div className="card p-4">
                <p className="text-3xl font-bold" style={{ color: 'var(--neon)' }}>{results.correct}</p>
                <p className="text-sm" style={{ color: isDark ? '#888' : '#666' }}>Correct</p>
              </div>
              <div className="card p-4">
                <p className="text-3xl font-bold" style={{ color: '#FF6B6B' }}>{results.total - results.correct}</p>
                <p className="text-sm" style={{ color: isDark ? '#888' : '#666' }}>Wrong</p>
              </div>
            </div>

            {/* Path Adjustment */}
            <div 
              className="card p-6 max-w-md mx-auto mb-8"
              style={{ 
                borderColor: results.adjustment === 'accelerate' ? 'var(--neon)' : 
                            results.adjustment === 'remediate' ? '#FF6B6B' : '#FFD700'
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--neon)' }} />
                <h3 className="font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>
                  Path Adjustment
                </h3>
              </div>
              <p style={{ color: isDark ? '#888' : '#666' }}>
                {results.adjustment === 'accelerate' && 'Your path will be accelerated - you can skip some basics!'}
                {results.adjustment === 'maintain' && 'Continue at your current pace - you\'re on track!'}
                {results.adjustment === 'remediate' && 'Additional resources will be added to strengthen fundamentals.'}
              </p>
            </div>

            {/* Question Review */}
            <div className="space-y-4 text-left max-w-xl mx-auto mb-8">
              <h3 className="font-semibold" style={{ color: isDark ? '#fff' : '#000' }}>Review Answers</h3>
              {results.results.map((r: any, i: number) => (
                <div 
                  key={i} 
                  className="card p-4"
                  style={{ borderColor: r.isCorrect ? 'var(--neon)' : '#FF6B6B' }}
                >
                  <div className="flex items-start gap-3">
                    {r.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--neon)' }} />
                    ) : (
                      <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#FF6B6B' }} />
                    )}
                    <div>
                      <p className="font-medium mb-1" style={{ color: isDark ? '#fff' : '#000' }}>
                        {test.questions[i].question}
                      </p>
                      {!r.isCorrect && (
                        <p className="text-sm" style={{ color: isDark ? '#888' : '#666' }}>
                          {r.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={() => setTest(null)} className="btn btn-outline">
                New Test
              </button>
              <button onClick={() => router.push('/dashboard')} className="btn btn-primary">
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        ) : (
          // Test Questions
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>
                  {test.title}
                </h2>
                <p style={{ color: isDark ? '#888' : '#666' }}>
                  Question {currentQuestion + 1} of {test.questions.length}
                </p>
              </div>
              <div 
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ 
                  background: timeLeft < 60 ? 'rgba(255,107,107,0.1)' : 'rgba(0,247,113,0.1)',
                  color: timeLeft < 60 ? '#FF6B6B' : 'var(--neon)'
                }}
              >
                <Clock className="w-5 h-5" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="progress-bar mb-8">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestion + 1) / test.questions.length) * 100}%` }} 
              />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card p-8 mb-8"
              >
                <h3 className="text-xl font-semibold mb-6" style={{ color: isDark ? '#fff' : '#000' }}>
                  {test.questions[currentQuestion].question}
                </h3>

                <div className="space-y-3">
                  {test.questions[currentQuestion].options.map((option: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => selectAnswer(i)}
                      className="w-full p-4 rounded-xl border-2 text-left transition-all"
                      style={{ 
                        background: answers[currentQuestion] === i 
                          ? 'rgba(0,247,113,0.1)' 
                          : (isDark ? '#111' : '#f8f8f8'),
                        borderColor: answers[currentQuestion] === i 
                          ? 'var(--neon)' 
                          : (isDark ? '#222' : '#eee'),
                        color: isDark ? '#fff' : '#000'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestion(c => c - 1)}
                disabled={currentQuestion === 0}
                className="btn btn-ghost"
                style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
              >
                Previous
              </button>

              {currentQuestion < test.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(c => c + 1)}
                  disabled={answers[currentQuestion] === -1}
                  className="btn btn-primary"
                  style={{ opacity: answers[currentQuestion] === -1 ? 0.5 : 1 }}
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={answers.includes(-1)}
                  className="btn btn-primary"
                  style={{ opacity: answers.includes(-1) ? 0.5 : 1 }}
                >
                  Submit Test
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
