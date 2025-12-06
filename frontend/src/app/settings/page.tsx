'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Palette, BookOpen, Shield, Save, Camera, Sun, Moon,
  Bell, Globe, Clock, Zap, Check
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'learning', label: 'Learning', icon: BookOpen },
  { id: 'privacy', label: 'Privacy', icon: Shield },
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

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-black mb-2" style={{ color: isDark ? '#fff' : '#000' }}>Settings</h1>
          <p className="text-base" style={{ color: isDark ? '#888' : '#666' }}>Manage your account and preferences</p>
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
                <h2 className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>Profile</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-black"
                    style={{ background: 'linear-gradient(135deg, #00F771, #00D4AA)' }}
                  >
                    {profile.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: isDark ? '#fff' : '#000' }}
                  >
                    <Camera className="w-4 h-4" /> Change Avatar
                  </button>
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: isDark ? '#ccc' : '#333' }}>Full Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, color: isDark ? '#fff' : '#000' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: isDark ? '#ccc' : '#333' }}>Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none opacity-50"
                      style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, color: isDark ? '#fff' : '#000' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: isDark ? '#ccc' : '#333' }}>Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                      style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, color: isDark ? '#fff' : '#000' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>Appearance</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                    <div className="flex items-center gap-3">
                      {isDark ? <Moon className="w-5 h-5" style={{ color: '#00F771' }} /> : <Sun className="w-5 h-5" style={{ color: '#F59E0B' }} />}
                      <div>
                        <p className="font-medium text-sm" style={{ color: isDark ? '#fff' : '#000' }}>Theme</p>
                        <p className="text-xs" style={{ color: isDark ? '#666' : '#888' }}>{isDark ? 'Dark mode' : 'Light mode'}</p>
                      </div>
                    </div>
                    <button onClick={toggleTheme} className="w-12 h-7 rounded-full relative transition-colors"
                      style={{ background: isDark ? '#00F771' : '#ccc' }}
                    >
                      <div className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all" style={{ left: isDark ? '26px' : '4px' }} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'learning' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>Learning Preferences</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: isDark ? '#ccc' : '#333' }}>Hours per week</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="40"
                        value={learning.hoursPerWeek}
                        onChange={(e) => setLearning({ ...learning, hoursPerWeek: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-16 text-center" style={{ color: '#00F771' }}>{learning.hoursPerWeek}h/week</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: isDark ? '#ccc' : '#333' }}>Learning Style</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['visual', 'reading', 'mixed'].map((style) => (
                        <button
                          key={style}
                          onClick={() => setLearning({ ...learning, learningStyle: style })}
                          className="p-3 rounded-xl text-sm font-medium transition-all"
                          style={{ 
                            background: learning.learningStyle === style ? 'rgba(0,247,113,0.15)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'),
                            color: learning.learningStyle === style ? '#00F771' : (isDark ? '#888' : '#666'),
                            border: learning.learningStyle === style ? '1px solid rgba(0,247,113,0.3)' : '1px solid transparent'
                          }}
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5" style={{ color: '#00F771' }} />
                      <div>
                        <p className="font-medium text-sm" style={{ color: isDark ? '#fff' : '#000' }}>Notifications</p>
                        <p className="text-xs" style={{ color: isDark ? '#666' : '#888' }}>Receive learning reminders</p>
                      </div>
                    </div>
                    <button onClick={() => setLearning({ ...learning, notifications: !learning.notifications })} className="w-12 h-7 rounded-full relative transition-colors"
                      style={{ background: learning.notifications ? '#00F771' : '#ccc' }}
                    >
                      <div className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all" style={{ left: learning.notifications ? '26px' : '4px' }} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#000' }}>Privacy & Security</h2>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                    <p className="font-medium text-sm mb-1" style={{ color: isDark ? '#fff' : '#000' }}>Data Privacy</p>
                    <p className="text-xs" style={{ color: isDark ? '#666' : '#888' }}>Your data is encrypted and stored securely. We never share your information with third parties.</p>
                  </div>
                  <button className="w-full p-4 rounded-xl text-left" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                    <p className="font-medium text-sm" style={{ color: isDark ? '#fff' : '#000' }}>Download My Data</p>
                    <p className="text-xs" style={{ color: isDark ? '#666' : '#888' }}>Export all your learning data</p>
                  </button>
                  <button className="w-full p-4 rounded-xl text-left" style={{ background: 'rgba(239,68,68,0.1)' }}>
                    <p className="font-medium text-sm text-red-400">Delete Account</p>
                    <p className="text-xs" style={{ color: isDark ? '#666' : '#888' }}>Permanently delete your account and data</p>
                  </button>
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
  )
}
