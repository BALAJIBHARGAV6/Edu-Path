'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Medal, 
  Crown,
  Flame,
  Star,
  TrendingUp,
  Users,
  Target,
  Zap,
  Loader2
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import PageWrapper from '@/components/PageWrapper'
import GradientText from '@/components/GradientText'
import { API_URL } from '@/lib/utils'
import toast from 'react-hot-toast'

const timeFilters = [
  { id: 'weekly', label: 'This Week' },
  { id: 'monthly', label: 'This Month' },
  { id: 'alltime', label: 'All Time' },
]

export default function LeaderboardPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [timeFilter, setTimeFilter] = useState('alltime')
  const [loading, setLoading] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  // Fetch leaderboard data from API
  const fetchLeaderboard = async (timeFrame: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${API_URL}/api/practice/leaderboard?timeFrame=${timeFrame}&limit=50`
      )
      const data = await response.json()
      
      if (data.success) {
        setLeaderboardData(data.leaderboard)
      } else {
        toast.error('Failed to load leaderboard')
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      toast.error('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard(timeFilter)
  }, [timeFilter])

  const getBadgeIcon = (badge: string | null) => {
    if (badge === 'crown') return <Crown className="w-5 h-5 text-yellow-400" />
    if (badge === 'silver') return <Medal className="w-5 h-5 text-gray-400" />
    if (badge === 'bronze') return <Medal className="w-5 h-5 text-amber-600" />
    return null
  }

  return (
    <PageWrapper>
      <div className="min-h-screen pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8" style={{ background: bg }}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" 
              style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)' }}>
              <Trophy className="w-4 h-4" style={{ color: accent }} />
              <span className="text-sm font-medium" style={{ color: accent }}>Top Performers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: text }}>
              <GradientText>Leaderboard</GradientText>
            </h1>
            <p className="text-lg" style={{ color: muted }}>
              Compete with learners worldwide and track your progress
            </p>
          </motion.div>

          {/* Time Filter */}
          <div className="flex justify-center gap-2 mb-8">
            {timeFilters.map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeFilter(tf.id)}
                className="px-6 py-2 rounded-lg font-medium transition-all"
                style={{
                  background: timeFilter === tf.id ? accent : subtle,
                  color: timeFilter === tf.id ? '#FFFFFF' : muted,
                  border: `1px solid ${timeFilter === tf.id ? accent : border}`
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: accent }} />
            </div>
          )}

          {/* Leaderboard */}
          {!loading && leaderboardData.length === 0 && (
            <div className="text-center py-20" style={{ color: muted }}>
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No data available for this time period</p>
            </div>
          )}

          {!loading && leaderboardData.length > 0 && (
            <div className="space-y-6">
              {/* Top 3 Podium */}
              {leaderboardData.length >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-3 gap-4 mb-8"
                >
                  {/* 2nd Place */}
                  <div className="flex flex-col items-center pt-8">
                    <div className="relative mb-4">
                      <img 
                        src={leaderboardData[1].avatar}
                        alt={leaderboardData[1].name}
                        className="w-20 h-20 rounded-2xl object-cover border-4"
                        style={{ borderColor: '#9CA3AF' }}
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: '#9CA3AF' }}>
                        {getBadgeIcon('silver')}
                      </div>
                    </div>
                    <p className="font-semibold text-center" style={{ color: text }}>{leaderboardData[1].name}</p>
                    <p className="text-sm" style={{ color: muted }}>{leaderboardData[1].xp.toLocaleString()} XP</p>
                    <div className="mt-4 w-full h-24 rounded-t-xl" style={{ background: 'linear-gradient(to top, rgba(156,163,175,0.2), transparent)' }} />
                  </div>

                  {/* 1st Place */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <img 
                        src={leaderboardData[0].avatar}
                        alt={leaderboardData[0].name}
                        className="w-24 h-24 rounded-2xl object-cover border-4"
                        style={{ borderColor: '#FBBF24' }}
                      />
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Crown className="w-8 h-8 text-yellow-400" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: '#FBBF24' }}>
                        {getBadgeIcon('crown')}
                      </div>
                    </div>
                    <p className="font-bold text-lg text-center" style={{ color: text }}>{leaderboardData[0].name}</p>
                    <p className="font-semibold" style={{ color: '#FBBF24' }}>{leaderboardData[0].xp.toLocaleString()} XP</p>
                    <div className="mt-4 w-full h-32 rounded-t-xl" style={{ background: 'linear-gradient(to top, rgba(251,191,36,0.2), transparent)' }} />
                  </div>

                  {/* 3rd Place */}
                  <div className="flex flex-col items-center pt-12">
                    <div className="relative mb-4">
                      <img 
                        src={leaderboardData[2].avatar}
                        alt={leaderboardData[2].name}
                        className="w-16 h-16 rounded-2xl object-cover border-4"
                        style={{ borderColor: '#CD7F32' }}
                      />
                      <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: '#CD7F32' }}>
                        {getBadgeIcon('bronze')}
                      </div>
                    </div>
                    <p className="font-semibold text-center text-sm" style={{ color: text }}>{leaderboardData[2].name}</p>
                    <p className="text-sm" style={{ color: muted }}>{leaderboardData[2].xp.toLocaleString()} XP</p>
                    <div className="mt-4 w-full h-16 rounded-t-xl" style={{ background: 'linear-gradient(to top, rgba(205,127,50,0.2), transparent)' }} />
                  </div>
                </motion.div>
              )}

              {/* Full Leaderboard Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: subtle, border: `1px solid ${border}` }}
              >
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium border-b" 
                  style={{ borderColor: border, color: muted }}>
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-5">User</div>
                  <div className="col-span-2 text-center">XP</div>
                  <div className="col-span-2 text-center">Streak</div>
                  <div className="col-span-2 text-center">Solved</div>
                </div>

                {/* Rows */}
                {leaderboardData.map((user, index) => (
                  <div 
                    key={user.rank}
                    className="grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:opacity-80"
                    style={{ 
                      borderBottom: index !== leaderboardData.length - 1 ? `1px solid ${border}` : 'none',
                      background: index < 3 ? (isDark ? 'rgba(37,99,235,0.05)' : 'rgba(37,99,235,0.03)') : 'transparent'
                    }}
                  >
                    <div className="col-span-1">
                      <span className="font-bold" style={{ 
                        color: user.rank === 1 ? '#FBBF24' : user.rank === 2 ? '#9CA3AF' : user.rank === 3 ? '#CD7F32' : muted 
                      }}>
                        #{user.rank}
                      </span>
                    </div>
                    <div className="col-span-5 flex items-center gap-3">
                      <img 
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium" style={{ color: text }}>{user.name}</p>
                          {user.badge && getBadgeIcon(user.badge)}
                        </div>
                        {user.achievements > 0 && (
                          <p className="text-xs" style={{ color: muted }}>{user.achievements} achievements</p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="font-semibold" style={{ color: accent }}>{user.xp.toLocaleString()}</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="font-medium" style={{ color: text }}>{user.streak}</span>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="font-medium" style={{ color: text }}>{user.problemsSolved}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
