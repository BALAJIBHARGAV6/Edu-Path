'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Video, Search, Play, Clock, Eye, ExternalLink,
  BookOpen, Code2, Server, Smartphone, Sparkles
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useStore } from '@/lib/store'
import { useAuth } from '@/context/AuthContext'

// Video data organized by topic
const videoLibrary: Record<string, any[]> = {
  'HTML': [
    { id: 1, title: 'HTML Crash Course for Beginners', channel: 'Traversy Media', duration: '1:00:42', views: '3.2M' },
    { id: 2, title: 'HTML Full Course - Build a Website', channel: 'freeCodeCamp', duration: '2:03:15', views: '5.1M' },
  ],
  'CSS': [
    { id: 3, title: 'CSS Tutorial - Zero to Hero', channel: 'freeCodeCamp', duration: '6:18:37', views: '2.8M' },
    { id: 4, title: 'CSS Flexbox in 15 Minutes', channel: 'Web Dev Simplified', duration: '15:03', views: '1.5M' },
    { id: 5, title: 'CSS Grid Tutorial', channel: 'Kevin Powell', duration: '32:15', views: '890K' },
  ],
  'JavaScript': [
    { id: 6, title: 'JavaScript Crash Course For Beginners', channel: 'Traversy Media', duration: '1:40:29', views: '4.5M' },
    { id: 7, title: 'JavaScript Full Course 2024', channel: 'freeCodeCamp', duration: '8:01:24', views: '2.1M' },
    { id: 8, title: 'Learn JavaScript - Full Course', channel: 'Bro Code', duration: '12:00:00', views: '1.8M' },
  ],
  'React': [
    { id: 9, title: 'React JS Crash Course 2024', channel: 'Traversy Media', duration: '1:48:47', views: '2.3M' },
    { id: 10, title: 'React Tutorial for Beginners', channel: 'Programming with Mosh', duration: '1:20:33', views: '3.5M' },
    { id: 11, title: 'Full React Course 2024', channel: 'freeCodeCamp', duration: '5:39:41', views: '1.9M' },
  ],
  'Node.js': [
    { id: 12, title: 'Node.js Crash Course', channel: 'Traversy Media', duration: '1:30:03', views: '2.1M' },
    { id: 13, title: 'Node.js Full Course', channel: 'freeCodeCamp', duration: '4:12:45', views: '3.5M' },
  ],
  'TypeScript': [
    { id: 14, title: 'TypeScript Full Course', channel: 'Net Ninja', duration: '1:23:45', views: '890K' },
    { id: 15, title: 'TypeScript Tutorial for Beginners', channel: 'Programming with Mosh', duration: '1:04:28', views: '1.2M' },
  ],
  'Git': [
    { id: 16, title: 'Git and GitHub for Beginners', channel: 'freeCodeCamp', duration: '1:08:29', views: '2.8M' },
    { id: 17, title: 'Git Tutorial for Beginners', channel: 'Programming with Mosh', duration: '1:09:13', views: '1.5M' },
  ],
  'General': [
    { id: 18, title: 'Web Development Full Course', channel: 'freeCodeCamp', duration: '21:00:00', views: '5.2M' },
    { id: 19, title: 'Frontend Developer Roadmap 2024', channel: 'Traversy Media', duration: '45:32', views: '1.8M' },
    { id: 20, title: 'How to Learn Programming', channel: 'TechLead', duration: '12:45', views: '2.1M' },
  ]
}

export default function VideosPage() {
  const { theme } = useTheme()
  const { currentRoadmap } = useStore()
  const { user } = useAuth()
  const isDark = theme === 'dark'
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<string>('All')

  // Extract topics from user's roadmap
  const roadmapTopics = currentRoadmap?.milestones?.flatMap((m: any) => 
    m.skills || [m.title]
  ) || currentRoadmap?.ai_generated_path?.milestones?.flatMap((m: any) => 
    m.skills || [m.title]
  ) || []

  // Get relevant videos based on roadmap or show all
  const getRecommendedVideos = () => {
    let videos: any[] = []
    
    if (roadmapTopics.length > 0) {
      // Match videos to roadmap topics
      const topicKeywords = ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'TypeScript', 'Git']
      roadmapTopics.forEach((topic: string) => {
        topicKeywords.forEach(keyword => {
          if (topic.toLowerCase().includes(keyword.toLowerCase()) && videoLibrary[keyword]) {
            videos = [...videos, ...videoLibrary[keyword]]
          }
        })
      })
      // Add general videos if we have some matches
      if (videos.length > 0 && videos.length < 6) {
        videos = [...videos, ...videoLibrary['General']]
      }
    }
    
    // If no matches or no roadmap, show all videos
    if (videos.length === 0) {
      Object.values(videoLibrary).forEach(vids => {
        videos = [...videos, ...vids]
      })
    }
    
    // Remove duplicates
    return Array.from(new Map(videos.map(v => [v.id, v])).values())
  }

  const allVideos = getRecommendedVideos()
  const topics = ['All', ...Object.keys(videoLibrary)]

  const filteredVideos = allVideos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase()) || 
                          v.channel.toLowerCase().includes(search.toLowerCase())
    const matchesTopic = selectedTopic === 'All' || 
                         Object.entries(videoLibrary).some(([topic, vids]) => 
                           topic === selectedTopic && vids.some(vid => vid.id === v.id)
                         )
    return matchesSearch && matchesTopic
  })

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-5 h-5" style={{ color: '#00FFE0' }} />
            <span className="text-sm font-medium" style={{ color: '#00FFE0' }}>
              {roadmapTopics.length > 0 ? 'Recommended for You' : 'Video Library'}
            </span>
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ color: isDark ? '#fff' : '#000' }}>Videos</h1>
          <p className="text-base" style={{ color: isDark ? '#888' : '#666' }}>
            {roadmapTopics.length > 0 
              ? 'Curated videos based on your learning path' 
              : 'Learn from the best tutorials on the web'}
          </p>
        </motion.div>

        {/* Search & Topics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: isDark ? '#666' : '#888' }} />
            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none"
              style={{ 
                background: isDark ? 'rgba(20,20,25,0.8)' : 'rgba(255,255,255,0.9)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                color: isDark ? '#fff' : '#000'
              }}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ 
                  background: selectedTopic === topic ? 'rgba(0,255,224,0.15)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                  color: selectedTopic === topic ? '#00FFE0' : (isDark ? '#888' : '#666'),
                  border: selectedTopic === topic ? '1px solid rgba(0,255,224,0.3)' : '1px solid transparent'
                }}
              >
                {topic}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Personalized Banner */}
        {roadmapTopics.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.15 }}
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ background: 'rgba(0,255,224,0.1)', border: '1px solid rgba(0,255,224,0.2)' }}
          >
            <Sparkles className="w-5 h-5" style={{ color: '#00FFE0' }} />
            <p className="text-sm" style={{ color: isDark ? '#ccc' : '#333' }}>
              Showing videos related to your learning path: <strong style={{ color: '#00FFE0' }}>{roadmapTopics.slice(0, 3).join(', ')}</strong>
              {roadmapTopics.length > 3 && ` and ${roadmapTopics.length - 3} more`}
            </p>
          </motion.div>
        )}

        {/* Videos Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video, i) => (
            <motion.a
              key={video.id}
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(video.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ y: -6 }}
              className="rounded-2xl overflow-hidden group"
              style={{ background: isDark ? 'rgba(20,20,25,0.8)' : 'rgba(255,255,255,0.9)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}` }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video flex items-center justify-center" 
                style={{ background: `linear-gradient(135deg, ${isDark ? '#1a1a1a' : '#f0f0f0'}, ${isDark ? '#0d0d0d' : '#e5e5e5'})` }}
              >
                <Video className="w-12 h-12" style={{ color: isDark ? '#333' : '#ccc' }} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,255,224,0.9)' }}>
                    <Play className="w-6 h-6 text-black ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium" style={{ background: 'rgba(0,0,0,0.8)', color: '#fff' }}>
                  {video.duration}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-[#00FFE0] transition-colors" style={{ color: isDark ? '#fff' : '#000' }}>
                  {video.title}
                </h3>
                <p className="text-xs mb-2" style={{ color: isDark ? '#888' : '#666' }}>{video.channel}</p>
                <div className="flex items-center gap-3 text-xs" style={{ color: isDark ? '#666' : '#888' }}>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views}</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#00FFE0' }} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <Video className="w-12 h-12 mx-auto mb-4" style={{ color: isDark ? '#333' : '#ddd' }} />
            <p className="text-lg font-medium" style={{ color: isDark ? '#888' : '#666' }}>No videos found</p>
            <p className="text-sm" style={{ color: isDark ? '#666' : '#888' }}>Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
