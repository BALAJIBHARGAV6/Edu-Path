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
  milestones?: Milestone[]
  skill?: {
    name: string
    level: string
  }
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

interface UserProgress {
  completedConcepts: number[]
  completedProblems: number[]
  watchedVideos: string[]
  readResources: number[]
  totalStudyTime: number
  streakDays: number
  lastActiveDate: string
}

interface AppState {
  onboardingStep: number
  onboardingData: OnboardingData
  currentRoadmap: Roadmap | null
  userProgress: UserProgress
  userSkills: string[]
  sidebarOpen: boolean
  isLoading: boolean
  
  setOnboardingStep: (step: number) => void
  updateOnboardingData: (data: Partial<OnboardingData>) => void
  resetOnboarding: () => void
  setCurrentRoadmap: (roadmap: Roadmap | null) => void
  updateUserProgress: (progress: Partial<UserProgress>) => void
  setUserSkills: (skills: string[]) => void
  addUserSkill: (skill: string) => void
  removeUserSkill: (skill: string) => void
  markConceptComplete: (conceptId: number) => void
  markProblemComplete: (problemId: number) => void
  markVideoWatched: (videoId: string) => void
  markResourceRead: (resourceId: number) => void
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

const initialUserProgress: UserProgress = {
  completedConcepts: [],
  completedProblems: [],
  watchedVideos: [],
  readResources: [],
  totalStudyTime: 0,
  streakDays: 0,
  lastActiveDate: new Date().toISOString(),
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      onboardingStep: 1,
      onboardingData: initialOnboardingData,
      currentRoadmap: null,
      userProgress: initialUserProgress,
      userSkills: ['JavaScript', 'React', 'CSS'],
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
      
      updateUserProgress: (progress) => set((state) => ({
        userProgress: { ...state.userProgress, ...progress }
      })),
      
      setUserSkills: (skills) => set({ userSkills: skills }),
      
      addUserSkill: (skill) => set((state) => ({
        userSkills: state.userSkills.includes(skill) 
          ? state.userSkills 
          : [...state.userSkills, skill]
      })),
      
      removeUserSkill: (skill) => set((state) => ({
        userSkills: state.userSkills.filter(s => s !== skill)
      })),
      
      markConceptComplete: (conceptId) => set((state) => ({
        userProgress: {
          ...state.userProgress,
          completedConcepts: state.userProgress.completedConcepts.includes(conceptId)
            ? state.userProgress.completedConcepts.filter(id => id !== conceptId)
            : [...state.userProgress.completedConcepts, conceptId]
        }
      })),
      
      markProblemComplete: (problemId) => set((state) => ({
        userProgress: {
          ...state.userProgress,
          completedProblems: state.userProgress.completedProblems.includes(problemId)
            ? state.userProgress.completedProblems
            : [...state.userProgress.completedProblems, problemId]
        }
      })),
      
      markVideoWatched: (videoId) => set((state) => ({
        userProgress: {
          ...state.userProgress,
          watchedVideos: state.userProgress.watchedVideos.includes(videoId)
            ? state.userProgress.watchedVideos
            : [...state.userProgress.watchedVideos, videoId]
        }
      })),
      
      markResourceRead: (resourceId) => set((state) => ({
        userProgress: {
          ...state.userProgress,
          readResources: state.userProgress.readResources.includes(resourceId)
            ? state.userProgress.readResources
            : [...state.userProgress.readResources, resourceId]
        }
      })),
      
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
