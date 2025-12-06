import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Milestone {
  id: number
  title: string
  description: string
  skills: string[]
  estimatedWeeks: number
  priority: 'high' | 'medium' | 'low'
  status: 'locked' | 'current' | 'completed'
  topics: Topic[]
}

export interface Topic {
  name: string
  description: string
  resources: string[]
  youtubeVideos?: YouTubeVideo[]
  isCompleted: boolean
}

export interface YouTubeVideo {
  videoId: string
  title: string
  thumbnail: string
  channelName: string
  description?: string
  watched: boolean
}

export interface TrendingSkill {
  name: string
  demandScore: number
  reason: string
}

export interface RoadmapPath {
  recommendedPath: string
  skillGaps: string[]
  milestones: Milestone[]
  youtubeQueries: string[]
  trendingSkills: TrendingSkill[]
}

export interface Roadmap {
  id: number
  user_id: string
  title: string
  description: string
  ai_generated_path: RoadmapPath
  created_at: string
  updated_at: string
}

interface OnboardingData {
  fullName: string
  email: string
  careerGoal: string
  learningStyle: 'visual' | 'reading' | 'hands-on' | 'mixed'
  skills: string[]
  experienceLevel: 'beginner' | 'intermediate' | 'advanced'
  learningPace: 'slow' | 'moderate' | 'fast'
  hoursPerWeek: number
  preferredContent: string[]
}

interface AppState {
  onboardingStep: number
  onboardingData: OnboardingData
  currentRoadmap: Roadmap | null
  sidebarOpen: boolean
  isLoading: boolean
  
  setOnboardingStep: (step: number) => void
  updateOnboardingData: (data: Partial<OnboardingData>) => void
  resetOnboarding: () => void
  setCurrentRoadmap: (roadmap: Roadmap | null) => void
  setSidebarOpen: (open: boolean) => void
  setLoading: (loading: boolean) => void
  updateTopicCompletion: (milestoneId: number, topicIndex: number, completed: boolean) => void
  clearAll: () => void
}

const initialOnboardingData: OnboardingData = {
  fullName: '',
  email: '',
  careerGoal: '',
  learningStyle: 'mixed',
  skills: [],
  experienceLevel: 'beginner',
  learningPace: 'moderate',
  hoursPerWeek: 10,
  preferredContent: ['videos', 'articles'],
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      onboardingStep: 1,
      onboardingData: initialOnboardingData,
      currentRoadmap: null,
      sidebarOpen: true,
      isLoading: false,

      clearAll: () => set({
        onboardingStep: 1,
        onboardingData: initialOnboardingData,
        currentRoadmap: null,
      }),

      setOnboardingStep: (step) => set({ onboardingStep: step }),
      
      updateOnboardingData: (data) => set((state) => ({
        onboardingData: { ...state.onboardingData, ...data }
      })),
      
      resetOnboarding: () => set({
        onboardingStep: 1,
        onboardingData: initialOnboardingData,
      }),
      
      setCurrentRoadmap: (roadmap) => set({ currentRoadmap: roadmap }),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      updateTopicCompletion: (milestoneId, topicIndex, completed) => set((state) => {
        if (!state.currentRoadmap) return state
        
        const updatedMilestones = state.currentRoadmap.ai_generated_path.milestones.map(
          (m) => {
            if (m.id !== milestoneId) return m
            const updatedTopics = m.topics.map((t, idx) => 
              idx === topicIndex ? { ...t, isCompleted: completed } : t
            )
            return { ...m, topics: updatedTopics }
          }
        )
        
        return {
          currentRoadmap: {
            ...state.currentRoadmap,
            ai_generated_path: {
              ...state.currentRoadmap.ai_generated_path,
              milestones: updatedMilestones,
            }
          }
        }
      }),
    }),
    {
      name: 'edupath-storage',
      partialize: (state) => ({
        onboardingData: state.onboardingData,
        currentRoadmap: state.currentRoadmap,
      }),
    }
  )
)
