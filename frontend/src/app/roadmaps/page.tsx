'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code2, Server, Layers, Cloud, Smartphone, Brain, Palette, Shield,
  Users, Clock, Star, ArrowRight, Loader2, Sparkles, X, ChevronRight, ChevronDown,
  BookOpen, Target, Zap, CheckCircle2, Save, Lock, Play, ArrowDown
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useStore } from '@/lib/store'
import toast from 'react-hot-toast'

const skills = [
  { id: 'frontend', name: 'Frontend Development', slug: 'frontend', desc: 'Build beautiful, responsive user interfaces', icon: Code2, color: '#3B82F6', learners: 45200,
    levels: { beginner: { topics: 18, hours: 140, prereqs: 'None' }, intermediate: { topics: 14, hours: 100, prereqs: 'HTML, CSS, JS basics' }, advanced: { topics: 10, hours: 70, prereqs: 'React/Vue experience' } } },
  { id: 'backend', name: 'Backend Development', slug: 'backend', desc: 'Create scalable APIs and server-side apps', icon: Server, color: '#10B981', learners: 38100,
    levels: { beginner: { topics: 16, hours: 130, prereqs: 'Basic programming' }, intermediate: { topics: 12, hours: 90, prereqs: 'Node.js or Python' }, advanced: { topics: 8, hours: 60, prereqs: 'API experience' } } },
  { id: 'fullstack', name: 'Full Stack Development', slug: 'fullstack', desc: 'Master both frontend and backend', icon: Layers, color: '#6366F1', learners: 52300,
    levels: { beginner: { topics: 20, hours: 180, prereqs: 'None' }, intermediate: { topics: 16, hours: 140, prereqs: 'Frontend or Backend' }, advanced: { topics: 12, hours: 100, prereqs: 'Full stack projects' } } },
  { id: 'devops', name: 'DevOps & Cloud', slug: 'devops', desc: 'Automate deployments and cloud infra', icon: Cloud, color: '#F59E0B', learners: 28400,
    levels: { beginner: { topics: 15, hours: 120, prereqs: 'Linux basics' }, intermediate: { topics: 12, hours: 90, prereqs: 'Docker, basic cloud' }, advanced: { topics: 8, hours: 60, prereqs: 'Kubernetes' } } },
  { id: 'mobile', name: 'Mobile Development', slug: 'mobile', desc: 'Create native and cross-platform apps', icon: Smartphone, color: '#06B6D4', learners: 31500,
    levels: { beginner: { topics: 16, hours: 130, prereqs: 'JavaScript basics' }, intermediate: { topics: 12, hours: 100, prereqs: 'React Native/Flutter' }, advanced: { topics: 8, hours: 70, prereqs: 'Published apps' } } },
  { id: 'data-science', name: 'Data Science & ML', slug: 'data-science', desc: 'Analyze data and build ML models', icon: Brain, color: '#8B5CF6', learners: 25800,
    levels: { beginner: { topics: 18, hours: 150, prereqs: 'Python, math' }, intermediate: { topics: 14, hours: 120, prereqs: 'Statistics, NumPy' }, advanced: { topics: 10, hours: 80, prereqs: 'ML algorithms' } } },
]

const levelDetails = {
  beginner: { title: 'Beginner', subtitle: 'Start from scratch', icon: BookOpen, color: '#3B82F6' },
  intermediate: { title: 'Intermediate', subtitle: 'Build on fundamentals', icon: Target, color: '#06B6D4' },
  advanced: { title: 'Advanced', subtitle: 'Master advanced concepts', icon: Zap, color: '#8B5CF6' }
}

export default function RoadmapsPage() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { setCurrentRoadmap, onboardingData } = useStore()
  const isDark = theme === 'dark'
  
  const [selectedSkill, setSelectedSkill] = useState<typeof skills[0] | null>(null)
  const [generating, setGenerating] = useState<string | null>(null)
  const [showRoadmap, setShowRoadmap] = useState(false)
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any>(null)
  const [expandedStep, setExpandedStep] = useState<number>(0)

  const handleSkillClick = (skill: typeof skills[0]) => {
    if (!user) {
      toast.error('Please sign in to generate a roadmap')
      return
    }
    setSelectedSkill(skill)
  }

  const generateRoadmap = async (level: 'beginner' | 'intermediate' | 'advanced') => {
    if (!selectedSkill || !user) return
    setGenerating(level)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          skillName: selectedSkill.name,
          level,
          fullName: onboardingData.fullName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          careerGoal: selectedSkill.name,
          skills: onboardingData.skills || [],
          experienceLevel: level,
          learningStyle: onboardingData.learningStyle || 'mixed',
          hoursPerWeek: onboardingData.hoursPerWeek || 10,
          learningPace: onboardingData.learningPace || 'moderate',
          preferredContent: ['videos', 'articles', 'projects']
        }),
      })

      const data = await response.json()
      
      if (data.success && data.roadmap) {
        const roadmapData = data.roadmap.ai_generated_path || data.roadmap
        setGeneratedRoadmap({ ...data.roadmap, skill: selectedSkill, level, milestones: roadmapData.milestones })
        setSelectedSkill(null)
        setShowRoadmap(true)
        setExpandedStep(0)
        toast.success('Roadmap generated!')
      } else {
        throw new Error(data.error || 'Failed to generate')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to generate roadmap')
    } finally {
      setGenerating(null)
    }
  }

  const saveRoadmap = () => {
    if (generatedRoadmap) {
      setCurrentRoadmap(generatedRoadmap)
      toast.success('Roadmap saved!')
    }
  }

  const resetView = () => {
    setShowRoadmap(false)
    setGeneratedRoadmap(null)
    setExpandedStep(0)
  }

  const milestones = generatedRoadmap?.milestones || []
  const totalWeeks = milestones.reduce((acc: number, m: any) => acc + (m.estimatedWeeks || 2), 0)

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: isDark ? '#0A0A0F' : '#F8FAFC' }}>
      
      {/* Steps View */}
      {showRoadmap && generatedRoadmap ? (
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <button onClick={resetView} className="flex items-center gap-2 text-sm mb-4 hover:opacity-70" style={{ color: '#3B82F6' }}>
              ← Back to Skills
            </button>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: isDark ? '#fff' : '#000' }}>
                  {generatedRoadmap.skill?.name}
                </h1>
                <p className="text-base" style={{ color: isDark ? '#888' : '#666' }}>
                  {levelDetails[generatedRoadmap.level as keyof typeof levelDetails]?.title} Path • {milestones.length} Steps • ~{totalWeeks} weeks
                </p>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveRoadmap}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: '#3B82F6', color: '#fff' }}
              >
                <Save className="w-4 h-4" /> Save Roadmap
              </motion.button>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-8 p-4 rounded-2xl" style={{ background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#3B82F6' }}>Your Progress</span>
              <span className="text-sm" style={{ color: isDark ? '#888' : '#666' }}>Step 1 of {milestones.length}</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
              <div className="h-full rounded-full" style={{ width: `${(1 / milestones.length) * 100}%`, background: 'linear-gradient(90deg, #3B82F6, #06B6D4)' }} />
            </div>
          </motion.div>

          {/* Steps List */}
          <div className="space-y-4">
            {milestones.map((step: any, i: number) => {
              const isExpanded = expandedStep === i
              const isCurrent = i === 0
              const isLocked = i > 0
              const StepIcon = isCurrent ? Play : isLocked ? Lock : CheckCircle2

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="rounded-2xl overflow-hidden"
                  style={{ 
                    background: isDark ? 'rgba(20,20,25,0.9)' : 'rgba(255,255,255,0.95)',
                    border: isCurrent ? '2px solid #3B82F6' : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    boxShadow: isCurrent ? '0 0 30px rgba(59,130,246,0.2)' : '0 4px 20px rgba(0,0,0,0.05)'
                  }}
                >
                  {/* Step Header */}
                  <button 
                    onClick={() => setExpandedStep(isExpanded ? -1 : i)}
                    className="w-full p-5 flex items-start gap-4 text-left"
                  >
                    {/* Step Number */}
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ 
                        background: isCurrent ? 'linear-gradient(135deg, #3B82F6, #06B6D4)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                        color: isCurrent ? '#fff' : (isDark ? '#666' : '#888')
                      }}
                    >
                      {isCurrent ? <Play className="w-5 h-5" /> : <span className="text-lg font-bold">{i + 1}</span>}
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wide" 
                          style={{ color: isCurrent ? '#3B82F6' : (isDark ? '#666' : '#888') }}
                        >
                          {isCurrent ? 'Current Step' : isLocked ? 'Locked' : 'Completed'}
                        </span>
                        {step.estimatedWeeks && (
                          <span className="flex items-center gap-1 text-xs" style={{ color: isDark ? '#666' : '#888' }}>
                            <Clock className="w-3 h-3" /> {step.estimatedWeeks} weeks
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: isLocked ? (isDark ? '#666' : '#888') : (isDark ? '#fff' : '#000') }}>
                        {step.title}
                      </h3>
                      <p className="text-sm line-clamp-2" style={{ color: isDark ? '#888' : '#666' }}>
                        {step.description}
                      </p>
                    </div>

                    {/* Expand Icon */}
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} 
                      style={{ color: isDark ? '#666' : '#888' }} 
                    />
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0">
                          <div className="border-t pt-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                            {/* Skills to Learn */}
                            {step.skills && step.skills.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold mb-2" style={{ color: isDark ? '#ccc' : '#333' }}>Skills You'll Learn</h4>
                                <div className="flex flex-wrap gap-2">
                                  {step.skills.map((skill: string, si: number) => (
                                    <span key={si} className="px-3 py-1.5 rounded-lg text-xs font-medium"
                                      style={{ background: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Topics */}
                            {step.topics && step.topics.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold mb-2" style={{ color: isDark ? '#ccc' : '#333' }}>Topics Covered</h4>
                                <div className="space-y-2">
                                  {step.topics.map((topic: any, ti: number) => (
                                    <div key={ti} className="flex items-start gap-3 p-3 rounded-lg"
                                      style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                                    >
                                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ background: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)' }}
                                      >
                                        <span className="text-xs font-bold" style={{ color: '#3B82F6' }}>{ti + 1}</span>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#000' }}>{topic.name}</p>
                                        {topic.description && (
                                          <p className="text-xs mt-0.5" style={{ color: isDark ? '#888' : '#666' }}>{topic.description}</p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Start Button */}
                            {isCurrent && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 rounded-xl text-sm font-bold"
                                style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', color: '#fff' }}
                              >
                                Start Learning →
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      ) : (
        /* Skills Grid View */
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#3B82F6' }} />
              <span className="text-sm font-medium" style={{ color: '#3B82F6' }}>AI-Generated Learning Paths</span>
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: isDark ? '#fff' : '#000' }}>Choose Your Path</h1>
            <p className="text-base max-w-xl mx-auto" style={{ color: isDark ? '#888' : '#666' }}>
              Select a skill to master. Our AI will create a personalized step-by-step learning roadmap.
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((skill, i) => (
              <motion.button key={skill.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}
                whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleSkillClick(skill)}
                className="text-left p-5 rounded-2xl transition-all group relative overflow-hidden"
                style={{ background: isDark ? 'rgba(20,20,25,0.8)' : 'rgba(255,255,255,0.9)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at top right, ${skill.color}15, transparent 70%)` }} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ background: `${skill.color}15`, border: `1px solid ${skill.color}30` }}
                  >
                    <skill.icon className="w-6 h-6" style={{ color: skill.color }} />
                  </div>
                  <h3 className="text-base font-bold mb-1 group-hover:text-[#3B82F6] transition-colors" style={{ color: isDark ? '#fff' : '#000' }}>{skill.name}</h3>
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: isDark ? '#888' : '#666' }}>{skill.desc}</p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: isDark ? '#666' : '#888' }}>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{(skill.learners / 1000).toFixed(1)}k</span>
                    <span className="flex items-center gap-1 text-amber-500"><Star className="w-3 h-3 fill-current" />4.9</span>
                  </div>
                  <div className="absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all" style={{ background: skill.color }}>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Level Selection Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
            onClick={() => !generating && setSelectedSkill(null)}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-3xl rounded-2xl p-6 overflow-hidden"
              style={{ background: isDark ? '#0E0E14' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${selectedSkill.color}20` }}>
                    <selectedSkill.icon className="w-6 h-6" style={{ color: selectedSkill.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: isDark ? '#666' : '#888' }}>Select Level</p>
                    <h2 className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>{selectedSkill.name}</h2>
                  </div>
                </div>
                <button onClick={() => !generating && setSelectedSkill(null)} className="p-2 rounded-lg" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} disabled={!!generating}>
                  <X className="w-4 h-4" style={{ color: isDark ? '#888' : '#666' }} />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
                  const info = levelDetails[level]
                  const skillLevel = selectedSkill.levels[level]
                  const isGenerating = generating === level

                  return (
                    <motion.button key={level} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} onClick={() => generateRoadmap(level)} disabled={!!generating}
                      className="text-left p-5 rounded-xl transition-all relative overflow-hidden group"
                      style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, opacity: generating && !isGenerating ? 0.5 : 1 }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at top, ${info.color}10, transparent 70%)` }} />
                      <div className="relative">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${info.color}15`, border: `1px solid ${info.color}30` }}>
                          <info.icon className="w-5 h-5" style={{ color: info.color }} />
                        </div>
                        <h3 className="text-lg font-bold mb-0.5" style={{ color: isDark ? '#fff' : '#000' }}>{info.title}</h3>
                        <p className="text-xs mb-3" style={{ color: isDark ? '#888' : '#666' }}>{info.subtitle}</p>
                        <div className="space-y-1.5 mb-4">
                          <div className="flex items-center gap-2 text-xs"><BookOpen className="w-3.5 h-3.5" style={{ color: info.color }} /><span style={{ color: isDark ? '#aaa' : '#555' }}>{skillLevel.topics} topics</span></div>
                          <div className="flex items-center gap-2 text-xs"><Clock className="w-3.5 h-3.5" style={{ color: info.color }} /><span style={{ color: isDark ? '#aaa' : '#555' }}>~{skillLevel.hours} hours</span></div>
                        </div>
                        <div className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm"
                          style={{ background: isGenerating ? `${info.color}30` : `${info.color}20`, color: info.color, border: `1px solid ${info.color}40` }}
                        >
                          {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <>Generate<ChevronRight className="w-4 h-4" /></>}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
