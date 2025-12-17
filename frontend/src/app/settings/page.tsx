'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Palette, BookOpen, Save, Sun, Moon,
  Sparkles, Code2, Target, X, Plus, AlertCircle, CheckCircle2, Loader2
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import PageWrapper from '@/components/PageWrapper'
import GradientText from '@/components/GradientText'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'learning', label: 'Learning', icon: BookOpen },
  { id: 'appearance', label:'Appearance', icon: Palette },
]

const popularSkills = ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'HTML', 'CSS', 'Git', 'MongoDB', 'SQL', 'Docker', 'Kubernetes', 'AWS', 'Redux', 'Vue.js', 'Angular']

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const isDark = theme === 'dark'
  
  // UI State
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Profile Data
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
  })
  
  const [learning, setLearning] = useState({
    hoursPerWeek: 10,
    learningStyle: 'mixed' as 'visual' | 'reading' | 'hands-on' | 'mixed',
  })
  
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [addingSkill, setAddingSkill] = useState(false)
  const [removingSkill, setRemovingSkill] = useState<string | null>(null)

  // Fetch user profile and skills
  useEffect(() => {
    if (!user) return

    const userId = user.id
    const userEmail = user.email

    async function fetchProfile() {
      try {
        setLoading(true)
        
        console.log('[SETTINGS] 🔍 Fetching profile for:', userId)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${userId}`)
        
        const data = await response.json()
        console.log('[SETTINGS] 📦 Profile response:', data)
        
        if (data.success && data.profile) {
          setProfile({
            fullName: data.profile.full_name || '',
            email: data.profile.email || userEmail || '',
          })
          
          setLearning({
            hoursPerWeek: data.profile.hours_per_week || 10,
            learningStyle: data.profile.learning_style || 'mixed',
          })
          
          const profileSkills = data.profile.skills
          console.log('[SETTINGS] 🎯 Skills from API:', profileSkills)
          
          if (Array.isArray(profileSkills)) {
            setSkills(profileSkills)
            console.log('[SETTINGS] ✅ Loaded', profileSkills.length, 'skills')
          } else {
            console.warn('[SETTINGS] ⚠️ Skills not array, using empty')
            setSkills([])
          }
        }
      } catch (err) {
        console.error('[SETTINGS] ❌ Error:', err)
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  // Add skill
  const addSkill = async (skillName?: string) => {
    const skillToAdd = (skillName || newSkill).trim()
    
    if (!skillToAdd) return
    if (skills.includes(skillToAdd)) {
      toast.error('Already have this skill')
      return
    }

    try {
      setAddingSkill(true)
      const updatedSkills = [...skills, skillToAdd]
      
      console.log('[SETTINGS] ➕ Adding:', skillToAdd)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${user?.id}/skills`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: updatedSkills })
      })
      
      const data = await response.json()
      console.log('[SETTINGS] 💾 Add response:', data)
      
      if (data.success) {
        setSkills(updatedSkills)
        setNewSkill('')
        toast.success(`✅ Added ${skillToAdd}!`)
        window.dispatchEvent(new Event('skillsUpdated'))
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      console.error('[SETTINGS] ❌ Add error:', err)
      toast.error('Failed to add skill')
    } finally {
      setAddingSkill(false)
    }
  }

  // Remove skill
  const removeSkill = async (skillToRemove: string) => {
    try {
      setRemovingSkill(skillToRemove)
      const updatedSkills = skills.filter(s => s !== skillToRemove)
      
      console.log('[SETTINGS] ➖ Removing:', skillToRemove)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${user?.id}/skills`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: updatedSkills })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSkills(updatedSkills)
        toast.success(`❌ Removed ${skillToRemove}`)
        window.dispatchEvent(new Event('skillsUpdated'))
      }
    } catch (err) {
      toast.error('Failed to remove')
    } finally {
      setRemovingSkill(null)
    }
  }

  // Save profile
  const handleSave = async () => {
    try {
      setSaving(true)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user?.id,
          fullName: profile.fullName,
          email: profile.email,
          learningStyle: learning.learningStyle,
          hoursPerWeek: learning.hoursPerWeek,
          skills
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('✅ Saved!')
        window.dispatchEvent(new Event('skillsUpdated'))
      }
    } catch (err) {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login')
  }, [authLoading, user, router])

  if (authLoading || loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center" style={{ background: isDark ? '#0A0A0F' : '#FAFAFA' }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2563EB' }} />
        </div>
      </PageWrapper>
    )
  }

  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  return (
    <PageWrapper>
      <div className="min-h-screen pt-24" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4" style={{ color: text }}>
              Customize <GradientText>Settings</GradientText>
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
                  style={{ 
                    background: activeTab === tab.id ? 'rgba(37,99,235,0.15)' : 'transparent',
                    color: activeTab === tab.id ? accent : muted
                  }}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="lg:col-span-3 rounded-2xl p-6" style={{ 
              background: isDark ? 'rgba(20,20,25,0.9)' : 'rgba(255,255,255,0.9)', 
              border: `1px solid ${border}`
            }}>
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold" style={{ color: text }}>Profile</h2>
                  
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="Full Name"
                    className="w-full p-3 rounded-xl"
                    style={{ background: isDark ? '#0A0A0F' : '#FAFAFA', border: '1px solid ' + border, color: text }}
                  />

                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="font-bold flex items-center gap-2" style={{ color: text }}>
                        <Code2 className="w-4 h-4" />
                        Skills
                      </label>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(37,99,235,0.1)', color: accent }}>
                        {skills.length}
                      </span>
                    </div>
                    
                    {skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {skills.map((skill) => (
                          <span key={skill} className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: 'white' }}>
                            <CheckCircle2 className="w-3 h-3" />
                            {skill}
                            <button onClick={() => removeSkill(skill)} disabled={removingSkill === skill} className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                              {removingSkill === skill ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="mb-4 p-4 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
                        <AlertCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#EF4444' }} />
                        <p className="text-sm" style={{ color: '#EF4444' }}>No skills yet</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        placeholder="Add skill..."
                        className="flex-1 p-3 rounded-xl"
                        style={{ background: isDark ? '#0A0A0F' : '#FAFAFA', border: '1px solid ' + border, color: text }}
                      />
                      <button onClick={() => addSkill()} disabled={addingSkill} className="px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
                        {addingSkill ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {popularSkills.filter(s => !skills.includes(s)).slice(0, 8).map((skill) => (
                        <button key={skill} onClick={() => addSkill(skill)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: muted }}>
                          <Plus className="w-3 h-3 inline mr-1" />{skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'learning' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold" style={{ color: text }}>Learning</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {(['visual', 'reading', 'hands-on', 'mixed'] as const).map((style) => (
                      <button key={style} onClick={() => setLearning(p => ({ ...p, learningStyle: style }))} className="p-4 rounded-xl font-semibold" style={{ background: learning.learningStyle === style ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'), color: learning.learningStyle === style ? '#fff' : text }}>
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold" style={{ color: text }}>Appearance</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => !isDark && toggleTheme()} className="p-6 rounded-xl font-semibold flex items-center justify-center gap-3" style={{ background: !isDark ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'rgba(255,255,255,0.05)', color: !isDark ? '#fff' : text }}>
                      <Sun className="w-5 h-5" />Light
                    </button>
                    <button onClick={() => isDark && toggleTheme()} className="p-6 rounded-xl font-semibold flex items-center justify-center gap-3" style={{ background: isDark ? 'linear-gradient(135deg, #6366F1, #4F46E5)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : text }}>
                      <Moon className="w-5 h-5" />Dark
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t" style={{ borderColor: border }}>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
