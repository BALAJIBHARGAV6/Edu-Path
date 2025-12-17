'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface UserProfile {
  id: string
  full_name: string
  email: string
  career_goal?: string
  experience_level?: string
  learning_style?: string
  hours_per_week?: number
  skills: string[]
}

interface UserProfileContextType {
  profile: UserProfile | null
  skills: string[]
  loading: boolean
  refreshProfile: () => Promise<void>
}

const UserProfileContext = createContext<UserProfileContextType>({
  profile: null,
  skills: [],
  loading: true,
  refreshProfile: async () => {},
})

export const useUserProfile = () => useContext(UserProfileContext)

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    if (!user?.id) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/${user.id}`)
      const data = await response.json()
      
      if (data.success && data.profile) {
        setProfile({
          ...data.profile,
          skills: Array.isArray(data.profile.skills) ? data.profile.skills : []
        })
      }
    } catch (error) {
      console.error('[UserProfile] Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [user?.id])

  // Listen for skill updates from settings page
  useEffect(() => {
    const handleSkillsUpdate = () => {
      fetchProfile()
    }
    window.addEventListener('skillsUpdated', handleSkillsUpdate)
    return () => window.removeEventListener('skillsUpdated', handleSkillsUpdate)
  }, [user?.id])

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        skills: profile?.skills || [],
        loading,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}
