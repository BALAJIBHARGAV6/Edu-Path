'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  FileText,
  Sparkles,
  Loader2,
  Youtube
} from 'lucide-react'
import { useStore, Topic, Milestone } from '@/lib/store'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

interface YouTubeVideo {
  videoId: string
  title: string
  thumbnail: string
  channelName: string
  description?: string
}

export default function LearnTopicPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { currentRoadmap, updateTopicCompletion } = useStore()
  
  const [topic, setTopic] = useState<Topic | null>(null)
  const [milestone, setMilestone] = useState<Milestone | null>(null)
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loadingVideos, setLoadingVideos] = useState(true)
  const [notes, setNotes] = useState('')
  const [generatingNotes, setGeneratingNotes] = useState(false)

  const topicId = params.topicId as string
  const [milestoneId, topicIndex] = topicId.split('-').map(Number)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (!currentRoadmap) {
      router.push('/onboarding')
      return
    }

    // Find the topic
    const foundMilestone = currentRoadmap.ai_generated_path.milestones.find(
      (m: Milestone) => m.id === milestoneId
    )
    
    if (foundMilestone && foundMilestone.topics[topicIndex]) {
      setMilestone(foundMilestone)
      setTopic(foundMilestone.topics[topicIndex])
      
      // Fetch videos for this topic
      fetchVideos(foundMilestone.topics[topicIndex].name)
    }
  }, [user, currentRoadmap, milestoneId, topicIndex, router])

  const fetchVideos = async (topicName: string) => {
    setLoadingVideos(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/videos/search?query=${encodeURIComponent(topicName + ' tutorial')}`
      )
      const data = await response.json()
      if (data.success) {
        setVideos(data.videos || [])
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoadingVideos(false)
    }
  }

  const generateAINotes = async () => {
    if (!topic) return
    
    setGeneratingNotes(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notes/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicName: topic.name,
          topicDescription: topic.description,
          milestoneTitle: milestone?.title
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setNotes(data.notes)
        toast.success('Notes generated successfully!')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error generating notes:', error)
      toast.error('Failed to generate notes')
    } finally {
      setGeneratingNotes(false)
    }
  }

  const markAsComplete = () => {
    if (milestone && topic) {
      updateTopicCompletion(milestone.id, topicIndex, !topic.isCompleted)
      setTopic({ ...topic, isCompleted: !topic.isCompleted })
      toast.success(topic.isCompleted ? 'Marked as incomplete' : 'Topic completed!')
    }
  }

  if (!topic || !milestone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </Link>
              <div>
                <p className="text-sm text-gray-500">{milestone.title}</p>
                <h1 className="text-xl font-bold text-gray-900">{topic.name}</h1>
              </div>
            </div>
            <button
              onClick={markAsComplete}
              className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
                topic.isCompleted
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              {topic.isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Topic Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">{topic.description}</p>
              
              {/* Skills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {milestone.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Video Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Video Tutorials</h2>
              </div>

              {loadingVideos ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              ) : videos.length > 0 ? (
                <div className="grid gap-4">
                  {videos.map((video) => (
                    <a
                      key={video.videoId}
                      href={`https://www.youtube.com/watch?v=${video.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                    >
                      <div className="relative w-40 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{video.channelName}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No videos found for this topic</p>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Study Notes</h2>
                </div>
              </div>

              {notes ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-600 text-sm leading-relaxed">
                    {notes}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-4">No notes yet</p>
                  <button
                    onClick={generateAINotes}
                    disabled={generatingNotes}
                    className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {generatingNotes ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate AI Notes
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Milestone Progress</h3>
              <div className="space-y-3">
                {milestone.topics.map((t, idx) => (
                  <div key={t.name} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      t.isCompleted ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}>
                      {t.isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm ${
                      t.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'
                    }`}>
                      {t.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}
