'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Video, Search, Play, Clock, Eye, ExternalLink,
  BookOpen, Code2, Server, Smartphone, Sparkles
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useStore } from '@/lib/store'
import { useAuth } from '@/context/AuthContext'
import { useUserProfile } from '@/context/UserProfileContext'
import PageWrapper from '@/components/PageWrapper'
import GradientText from '@/components/GradientText'

// Video data organized by topic with real YouTube links
const videoLibrary: Record<string, any[]> = {
  'HTML': [
    { id: 1, title: 'HTML Crash Course for Beginners', channel: 'Traversy Media', duration: '1:00:42', views: '3.2M', videoId: 'UB1O30fR-EE', url: 'https://www.youtube.com/watch?v=UB1O30fR-EE' },
    { id: 2, title: 'HTML Full Course - Build a Website', channel: 'freeCodeCamp', duration: '2:03:15', views: '5.1M', videoId: 'pQN-pnXPaVg', url: 'https://www.youtube.com/watch?v=pQN-pnXPaVg' },
  ],
  'CSS': [
    { id: 3, title: 'CSS Tutorial - Zero to Hero', channel: 'freeCodeCamp', duration: '6:18:37', views: '2.8M', videoId: '1Rs2ND1ryYc', url: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc' },
    { id: 4, title: 'CSS Flexbox in 15 Minutes', channel: 'Web Dev Simplified', duration: '15:03', views: '1.5M', videoId: 'fYq5PXgSsbE', url: 'https://www.youtube.com/watch?v=fYq5PXgSsbE' },
    { id: 5, title: 'CSS Grid Tutorial', channel: 'Kevin Powell', duration: '32:15', views: '890K', videoId: 'jV8B24rSN5o', url: 'https://www.youtube.com/watch?v=jV8B24rSN5o' },
  ],
  'JavaScript': [
    { id: 6, title: 'JavaScript Crash Course For Beginners', channel: 'Traversy Media', duration: '1:40:29', views: '4.5M', videoId: 'hdI2bqOjy3c', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c' },
    { id: 7, title: 'JavaScript Full Course 2024', channel: 'freeCodeCamp', duration: '8:01:24', views: '2.1M', videoId: 'PkZNo7MFNFg', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg' },
    { id: 8, title: 'Learn JavaScript - Full Course', channel: 'Bro Code', duration: '12:00:00', views: '1.8M', videoId: '8dWL3wF_OMw', url: 'https://www.youtube.com/watch?v=8dWL3wF_OMw' },
  ],
  'React': [
    { id: 9, title: 'React JS Crash Course 2024', channel: 'Traversy Media', duration: '1:48:47', views: '2.3M', videoId: 'w7ejDZ8SWv8', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8' },
    { id: 10, title: 'React Tutorial for Beginners', channel: 'Programming with Mosh', duration: '1:20:33', views: '3.5M', videoId: 'Ke90Tje7VS0', url: 'https://www.youtube.com/watch?v=Ke90Tje7VS0' },
    { id: 11, title: 'Full React Course 2024', channel: 'freeCodeCamp', duration: '5:39:41', views: '1.9M', videoId: 'bMknfKXIFA8', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8' },
  ],
  'Node.js': [
    { id: 12, title: 'Node.js Crash Course', channel: 'Traversy Media', duration: '1:30:03', views: '2.1M', videoId: 'fBNz5xF-Kx4', url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4' },
    { id: 13, title: 'Node.js Full Course', channel: 'freeCodeCamp', duration: '4:12:45', views: '3.5M', videoId: 'RLtyhwFtXQA', url: 'https://www.youtube.com/watch?v=RLtyhwFtXQA' },
  ],
  'TypeScript': [
    { id: 14, title: 'TypeScript Full Course', channel: 'Net Ninja', duration: '1:23:45', views: '890K', videoId: '2pZmKW9-I_k', url: 'https://www.youtube.com/watch?v=2pZmKW9-I_k' },
    { id: 15, title: 'TypeScript Tutorial for Beginners', channel: 'Programming with Mosh', duration: '1:04:28', views: '1.2M', videoId: 'd56mG7DezGs', url: 'https://www.youtube.com/watch?v=d56mG7DezGs' },
  ],
  'Git': [
    { id: 16, title: 'Git and GitHub for Beginners', channel: 'freeCodeCamp', duration: '1:08:29', views: '2.8M', videoId: 'RGOj5yH7evk', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
    { id: 17, title: 'Git Tutorial for Beginners', channel: 'Programming with Mosh', duration: '1:09:13', views: '1.5M', videoId: '8JJ101D3knE', url: 'https://www.youtube.com/watch?v=8JJ101D3knE' },
  ],
  'Python': [
    { id: 21, title: 'Python for Beginners', channel: 'freeCodeCamp', duration: '4:26:52', views: '8.2M', videoId: 'rfscVS0vtbw', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw' },
    { id: 22, title: 'Python Full Course', channel: 'Programming with Mosh', duration: '6:14:07', views: '4.1M', videoId: '_uQrJ0TkZlc', url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc' },
  ],
  'MongoDB': [
    { id: 23, title: 'MongoDB Crash Course', channel: 'Traversy Media', duration: '30:44', views: '1.2M', videoId: '-56x56UppqQ', url: 'https://www.youtube.com/watch?v=-56x56UppqQ' },
    { id: 24, title: 'MongoDB Tutorial for Beginners', channel: 'Academind', duration: '1:14:32', views: '890K', videoId: '9OPP_1eAENg', url: 'https://www.youtube.com/watch?v=9OPP_1eAENg' },
  ],
  'SQL': [
    { id: 25, title: 'SQL Tutorial - Full Database Course', channel: 'freeCodeCamp', duration: '4:20:28', views: '3.5M', videoId: 'HXV3zeQKqGY', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
    { id: 26, title: 'MySQL Tutorial for Beginners', channel: 'Programming with Mosh', duration: '3:10:14', views: '2.8M', videoId: '7S_tz1z_5bA', url: 'https://www.youtube.com/watch?v=7S_tz1z_5bA' },
  ],
  'Docker': [
    { id: 27, title: 'Docker Tutorial for Beginners', channel: 'TechWorld with Nana', duration: '3:10:23', views: '2.1M', videoId: '3c-iBn73dDE', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE' },
    { id: 28, title: 'Docker Crash Course', channel: 'Traversy Media', duration: '46:33', views: '1.5M', videoId: 'pg19Z8LL06w', url: 'https://www.youtube.com/watch?v=pg19Z8LL06w' },
  ],
  'AWS': [
    { id: 29, title: 'AWS Tutorial for Beginners', channel: 'freeCodeCamp', duration: '4:13:52', views: '1.8M', videoId: 'ulprqHHWlng', url: 'https://www.youtube.com/watch?v=ulprqHHWlng' },
    { id: 30, title: 'AWS Certified Cloud Practitioner', channel: 'freeCodeCamp', duration: '13:56:29', views: '3.2M', videoId: 'SOTamWNgDKc', url: 'https://www.youtube.com/watch?v=SOTamWNgDKc' },
  ],
  'Redux': [
    { id: 31, title: 'Redux Tutorial for Beginners', channel: 'Dev Ed', duration: '51:17', views: '890K', videoId: 'CVpUuw9XSjY', url: 'https://www.youtube.com/watch?v=CVpUuw9XSjY' },
    { id: 32, title: 'Redux Crash Course', channel: 'Traversy Media', duration: '35:18', views: '750K', videoId: '93p3LxR9xfM', url: 'https://www.youtube.com/watch?v=93p3LxR9xfM' },
  ],
  'Vue.js': [
    { id: 33, title: 'Vue.js Course for Beginners', channel: 'freeCodeCamp', duration: '3:20:46', views: '1.1M', videoId: 'FXpIoQ_rT_c', url: 'https://www.youtube.com/watch?v=FXpIoQ_rT_c' },
    { id: 34, title: 'Vue 3 Tutorial', channel: 'Net Ninja', duration: '45:23', views: '620K', videoId: 'YrxBCBibVo0', url: 'https://www.youtube.com/watch?v=YrxBCBibVo0' },
  ],
  'Angular': [
    { id: 35, title: 'Angular Tutorial for Beginners', channel: 'Programming with Mosh', duration: '2:02:08', views: '2.3M', videoId: 'k5E2AVpwsko', url: 'https://www.youtube.com/watch?v=k5E2AVpwsko' },
    { id: 36, title: 'Angular Crash Course', channel: 'Traversy Media', duration: '1:11:12', views: '1.5M', videoId: 'Fdf5aTYRW0E', url: 'https://www.youtube.com/watch?v=Fdf5aTYRW0E' },
  ],
  'GraphQL': [
    { id: 37, title: 'GraphQL Tutorial', channel: 'freeCodeCamp', duration: '4:04:54', views: '780K', videoId: 'ed8SzALpx1Q', url: 'https://www.youtube.com/watch?v=ed8SzALpx1Q' },
    { id: 38, title: 'GraphQL Crash Course', channel: 'Traversy Media', duration: '38:05', views: '560K', videoId: 'BcLNfwF04Kw', url: 'https://www.youtube.com/watch?v=BcLNfwF04Kw' },
  ],
  'PostgreSQL': [
    { id: 39, title: 'PostgreSQL Tutorial', channel: 'freeCodeCamp', duration: '4:11:23', views: '890K', videoId: 'qw--VYLpxG4', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4' },
    { id: 40, title: 'Learn PostgreSQL', channel: 'Amigoscode', duration: '1:22:03', views: '420K', videoId: 'SpfIwlAYaKk', url: 'https://www.youtube.com/watch?v=SpfIwlAYaKk' },
  ],
  'General': [
    { id: 18, title: 'Web Development Full Course', channel: 'freeCodeCamp', duration: '21:00:00', views: '5.2M', videoId: 'nu_pCVPKzTk', url: 'https://www.youtube.com/watch?v=nu_pCVPKzTk' },
    { id: 19, title: 'Frontend Developer Roadmap 2024', channel: 'Traversy Media', duration: '45:32', views: '1.8M', videoId: 'UuKdTVVhKGM', url: 'https://www.youtube.com/watch?v=UuKdTVVhKGM' },
    { id: 20, title: 'How to Learn Programming', channel: 'TechLead', duration: '12:45', views: '2.1M', videoId: 'mvK0UzFNw1Q', url: 'https://www.youtube.com/watch?v=mvK0UzFNw1Q' },
  ]
}

export default function VideosPage() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { skills: userSkills, profile: userProfile } = useUserProfile()
  const router = useRouter()
  const isDark = theme === 'dark'
  const [search, setSearch] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<string>('All')

  // Get user's actual skills from shared context (already loaded in background)
  const careerGoal = userProfile?.career_goal || ''

  // Get career-specific topics
  const getCareerTopics = (career: string): string[] => {
    const careerMap: Record<string, string[]> = {
      'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Git'],
      'Backend Developer': ['Node.js', 'Python', 'Java', 'SQL', 'APIs', 'Git'],
      'Full Stack Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'TypeScript', 'Git'],
      'Mobile Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'JavaScript', 'Git'],
      'DevOps Engineer': ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'Git'],
      'Data Scientist': ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'SQL', 'Statistics']
    }
    return careerMap[career] || ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'TypeScript', 'Git']
  }

  // ONLY show videos for user's actual skills - no fallback
  const getVideosForSkills = (): Record<string, any[]> => {
    if (userSkills.length > 0) {
      // Filter video library by user's actual skills ONLY
      const skillLibrary: Record<string, any[]> = {}
      userSkills.forEach((skill: string) => {
        // Match skill to video library keys (case-insensitive, exact match preferred)
        Object.keys(videoLibrary).forEach((key: string) => {
          if (key.toLowerCase() === skill.toLowerCase()) {
            skillLibrary[key] = videoLibrary[key]
          } else if (skill.toLowerCase().includes(key.toLowerCase())) {
            skillLibrary[key] = videoLibrary[key]
          } else if (key.toLowerCase().includes(skill.toLowerCase())) {
            skillLibrary[key] = videoLibrary[key]
          }
        })
      })
      return skillLibrary
    }
    // Return empty if no skills - user must add skills first
    return {}
  }
  
  const careerSpecificLibrary = getVideosForSkills()
  const roadmapTopics = userSkills.length > 0 ? userSkills : []

  // Get relevant videos based on user skills ONLY - no fallback to all videos
  const getRecommendedVideos = () => {
    let videos: any[] = []
    
    // ONLY show videos if user has skills
    if (userSkills.length > 0 && Object.keys(careerSpecificLibrary).length > 0) {
      // Get all videos from skill-specific library
      Object.values(careerSpecificLibrary).forEach(vids => {
        videos = [...videos, ...vids]
      })
    }
    
    // Remove duplicates
    return Array.from(new Map(videos.map(v => [v.id, v])).values())
  }

  const allVideos = getRecommendedVideos()
  const topics = ['All', ...Object.keys(careerSpecificLibrary)]

  const filteredVideos = allVideos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase()) || 
                          v.channel.toLowerCase().includes(search.toLowerCase())
    const matchesTopic = selectedTopic === 'All' || 
                         Object.entries(careerSpecificLibrary).some(([topic, vids]) => 
                           topic === selectedTopic && vids.some(vid => vid.id === v.id)
                         )
    return matchesSearch && matchesTopic
  })

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  return (
    <PageWrapper>
      <div className="min-h-screen pt-16 sm:pt-20 md:pt-24" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <Video className="w-4 h-4" style={{ color: accent }} />
            <span className="text-sm font-medium" style={{ color: accent }}>Curated Video Library</span>
          </motion.div>
          
          {/* Main Heading - EXACT Same Style */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ color: text }}>
            Learn from the best <GradientText>video tutorials</GradientText>
          </h1>
          
          {/* Description - EXACT Same Style */}
          <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-8" style={{ color: muted }}>
            Access thousands of high-quality video tutorials from top creators. Learn at your own pace with content tailored to your skill level.
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

        {/* Personalized Banner or Empty State */}
        {userSkills.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.15 }}
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ background: 'rgba(0,255,224,0.1)', border: '1px solid rgba(0,255,224,0.2)' }}
          >
            <Sparkles className="w-5 h-5" style={{ color: '#00FFE0' }} />
            <p className="text-sm" style={{ color: isDark ? '#ccc' : '#333' }}>
              Showing videos for your skills: <strong style={{ color: '#00FFE0' }}>{userSkills.slice(0, 3).join(', ')}</strong>
              {userSkills.length > 3 && ` and ${userSkills.length - 3} more`}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.15 }}
            className="mb-6 p-6 rounded-xl text-center"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <Code2 className="w-12 h-12 mx-auto mb-3" style={{ color: '#EF4444' }} />
            <h3 className="text-lg font-bold mb-2" style={{ color: isDark ? '#fff' : '#000' }}>No Skills Added Yet</h3>
            <p className="text-sm mb-4" style={{ color: isDark ? '#aaa' : '#666' }}>
              Add your skills in Settings to see personalized video recommendations
            </p>
            <button
              onClick={() => router.push('/settings')}
              className="px-6 py-2.5 rounded-lg font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
            >
              Go to Settings
            </button>
          </motion.div>
        )}

        {/* Videos Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video, i) => (
            <motion.a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded-lg">
                  {video.duration}
                </div>
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l8-5-8-5z"/>
                    </svg>
                  </motion.div>
                </div>

                {/* Quality Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg">
                  HD
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-base mb-3 line-clamp-2 leading-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {video.channel.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {video.channel}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      {video.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                      {video.duration}
                    </span>
                  </div>
                  

                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </motion.div>
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
    </PageWrapper>
  )
}
