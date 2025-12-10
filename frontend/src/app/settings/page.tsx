'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Palette, BookOpen, Shield, Save, Camera, Sun, Moon,
  Bell, Globe, Clock, Zap, Check, Sparkles, Code2, Brain, Target
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import PageWrapper from '@/components/PageWrapper'
import GradientText from '@/components/GradientText'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'learning', label: 'Learning', icon: BookOpen },
  { id: 'appearance', label:'Appearance', icon: Palette },
]

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const { user, loading } = useAuth()
  const { onboardingData, updateOnboardingData } = useStore()
  const router = useRouter()
  const isDark = theme === 'dark'
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({
    fullName: onboardingData.fullName || '',
    email: user?.email || '',
    bio: '',
  })

  const [learning, setLearning] = useState({
    hoursPerWeek: onboardingData.hoursPerWeek || 10,
    learningStyle: onboardingData.learningStyle || 'mixed',
    notifications: true,
  })

  const { userSkills, addUserSkill, removeUserSkill } = useStore()
  const [newSkill, setNewSkill] = useState('')
  
  const popularSkills = ['JavaScript', 'React', 'Python', 'Node.js', 'TypeScript', 'CSS', 'HTML', 'Git', 'MongoDB', 'SQL']

  const addSkill = () => {
    if (newSkill.trim() && !userSkills.includes(newSkill.trim())) {
      addUserSkill(newSkill.trim())
      setNewSkill('')
      toast.success(`Added ${newSkill.trim()} to your skills!`)
    }
  }

  const removeSkill = (skill: string) => {
    removeUserSkill(skill)
    toast.success(`Removed ${skill} from your skills!`)
  }

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [loading, user, router])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    updateOnboardingData({ fullName: profile.fullName, hoursPerWeek: learning.hoursPerWeek, learningStyle: learning.learningStyle as any })
    toast.success('Settings saved!')
    setSaving(false)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: isDark ? '#0A0A0F' : '#FAFAFA' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#00F771', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  return (
    <PageWrapper>
      <div className="min-h-screen pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section - EXACT Same as Home Page */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            {/* Badge - EXACT Same Style */}
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
              <span className="text-sm font-medium" style={{ color: accent }}>Account Settings</span>
            </motion.div>
            
            {/* Main Heading - EXACT Same Style */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ color: text }}>
              Customize your <GradientText>learning experience</GradientText>
            </h1>
            
            {/* Description - EXACT Same Style */}
            <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-8" style={{ color: muted }}>
              Manage your skills, preferences, and account settings to get personalized content across all pages.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Tabs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="lg:col-span-1 space-y-1"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all"
                  style={{ 
                    background: activeTab === tab.id ? 'rgba(0,247,113,0.15)' : 'transparent',
                    color: activeTab === tab.id ? '#00F771' : (isDark ? '#888' : '#666')
                  }}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="lg:col-span-3 rounded-2xl p-6" style={{ background: isDark ? 'rgba(20,20,25,0.8)' : 'rgba(255,255,255,0.9)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}
            >
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold" style={{ color: text }}>Profile Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: text }}>Full Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full p-3 rounded-xl text-sm outline-none"
                      style={{ 
                        background: isDark ? '#0A0A0F' : '#FAFAFA',
                        border: '1px solid ' + border,
                        color: text
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: text }}>Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-3 rounded-xl text-sm outline-none"
                      style={{ 
                        background: isDark ? '#0A0A0F' : '#FAFAFA',
                        border: '1px solid ' + border,
                        color: text
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: text }}>Your Skills & Stack</label>
                    <p className="text-xs mb-4" style={{ color: muted }}>
                      Adding skills will automatically update content across Practice, Resources, and Videos pages
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {userSkills.map((skill, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors text-xs"
                          >
                            ×
                          </button>
                        </motion.span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        placeholder="Add a skill (e.g., React, Python, Node.js)"
                        className="flex-1 p-3 rounded-xl text-sm outline-none"
                        style={{ 
                          background: isDark ? '#0A0A0F' : '#FAFAFA',
                          border: '1px solid ' + border,
                          color: text
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addSkill}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                      >
                        Add
                      </motion.button>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2" style={{ color: text }}>Popular Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {popularSkills.filter(skill => !userSkills.includes(skill)).map((skill) => (
                          <motion.button
                            key={skill}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addUserSkill(skill)}
                            className="px-3 py-1 rounded-lg text-sm font-medium transition-all"
                            style={{
                              background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                              color: muted,
                              border: '1px solid ' + border
                            }}
                          >
                            + {skill}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'learning' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold" style={{ color: text }}>Learning Preferences</h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: text }}>Learning Style</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['visual', 'reading', 'hands-on', 'mixed'] as const).map((style) => (
                        <motion.button
                          key={style}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setLearning(prev => ({ ...prev, learningStyle: style }))}
                          className="p-4 rounded-xl text-sm font-semibold transition-all"
                          style={{
                            background: learning.learningStyle === style 
                              ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)' 
                              : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                            color: learning.learningStyle === style ? '#fff' : text,
                            border: '1px solid ' + (learning.learningStyle === style ? '#3B82F6' : border)
                          }}
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: text }}>Study Hours per Week</label>
                    <div className="grid grid-cols-4 gap-3">
                      {[5, 10, 15, 20].map((hours) => (
                        <motion.button
                          key={hours}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setLearning(prev => ({ ...prev, hoursPerWeek: hours }))}
                          className="p-4 rounded-xl text-sm font-semibold transition-all"
                          style={{
                            background: learning.hoursPerWeek === hours 
                              ? 'linear-gradient(135deg, #10B981, #059669)' 
                              : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                            color: learning.hoursPerWeek === hours ? '#fff' : text,
                            border: '1px solid ' + (learning.hoursPerWeek === hours ? '#10B981' : border)
                          }}
                        >
                          {hours}h
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold" style={{ color: text }}>Appearance</h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: text }}>Theme</label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => !isDark && toggleTheme()}
                        className="p-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-3"
                        style={{
                          background: !isDark 
                            ? 'linear-gradient(135deg, #F59E0B, #D97706)' 
                            : 'rgba(255,255,255,0.05)',
                          color: !isDark ? '#fff' : text,
                          border: '1px solid ' + (!isDark ? '#F59E0B' : border)
                        }}
                      >
                        <Sun className="w-5 h-5" />
                        Light Mode
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => isDark && toggleTheme()}
                        className="p-4 rounded-xl text-sm font-semibold transition-all flex items-center gap-3"
                        style={{
                          background: isDark 
                            ? 'linear-gradient(135deg, #6366F1, #4F46E5)' 
                            : 'rgba(0,0,0,0.05)',
                          color: isDark ? '#fff' : text,
                          border: '1px solid ' + (isDark ? '#6366F1' : border)
                        }}
                      >
                        <Moon className="w-5 h-5" />
                        Dark Mode
                      </motion.button>
                    </div>
                  </div>

                  <div className="mt-8 p-6 rounded-xl" style={{ background: isDark ? 'rgba(0,247,113,0.1)' : 'rgba(0,247,113,0.05)', border: '1px solid rgba(0,247,113,0.2)' }}>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#00F771' }}>
                      <Target className="w-5 h-5" />
                      How Progress Updates Work
                    </h3>
                    <div className="space-y-3 text-sm" style={{ color: text }}>
                      <p>🎯 <strong>Click concepts on Dashboard</strong> to mark them complete</p>
                      <p>📊 <strong>Progress bar updates automatically</strong> showing your completion percentage</p>
                      <p>🔓 <strong>Next concepts unlock</strong> as you complete previous ones</p>
                      <p>🎉 <strong>Toast notifications</strong> celebrate your achievements</p>
                      <p>📈 <strong>Stats update in real-time</strong> across all pages</p>
                      <p>🎮 <strong>Practice problems</strong> and videos filter based on your skills</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, #00F771, #00D4AA)' }}
                >
                  {saving ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#000', borderTopColor: 'transparent' }} /> : <Save className="w-4 h-4" />}
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
