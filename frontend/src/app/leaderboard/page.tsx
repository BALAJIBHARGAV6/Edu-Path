'use client'

import { useState } from 'react'
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
  Zap
} from 'lucide-react'

const timeFilters = [
  { id: 'weekly', label: 'This Week' },
  { id: 'monthly', label: 'This Month' },
  { id: 'alltime', label: 'All Time' },
]

const leaderboardData = [
  {
    rank: 1,
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    xp: 15420,
    streak: 45,
    problemsSolved: 234,
    badge: 'crown'
  },
  {
    rank: 2,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    xp: 14890,
    streak: 38,
    problemsSolved: 212,
    badge: 'silver'
  },
  {
    rank: 3,
    name: 'Michael Park',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    xp: 13750,
    streak: 32,
    problemsSolved: 198,
    badge: 'bronze'
  },
  {
    rank: 4,
    name: 'Emily Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    xp: 12340,
    streak: 28,
    problemsSolved: 176,
    badge: null
  },
  {
    rank: 5,
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    xp: 11890,
    streak: 25,
    problemsSolved: 165,
    badge: null
  },
  {
    rank: 6,
    name: 'Lisa Wang',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    xp: 10560,
    streak: 21,
    problemsSolved: 154,
    badge: null
  },
  {
    rank: 7,
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    xp: 9870,
    streak: 18,
    problemsSolved: 142,
    badge: null
  },
  {
    rank: 8,
    name: 'Anna Martinez',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    xp: 9120,
    streak: 15,
    problemsSolved: 128,
    badge: null
  },
  {
    rank: 9,
    name: 'Chris Lee',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop',
    xp: 8450,
    streak: 12,
    problemsSolved: 115,
    badge: null
  },
  {
    rank: 10,
    name: 'Sophie Brown',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    xp: 7890,
    streak: 10,
    problemsSolved: 102,
    badge: null
  },
]

const currentUser = {
  rank: 156,
  name: 'You',
  xp: 1250,
  streak: 7,
  problemsSolved: 23
}

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState('weekly')

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="badge badge-primary mb-4">LEADERBOARD</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Top <span className="gradient-text">Learners</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Compete with fellow learners and climb the ranks
          </p>
        </motion.div>

        {/* Time Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center gap-2 mb-8"
        >
          {timeFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setTimeFilter(filter.id)}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                timeFilter === filter.id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {/* 2nd Place */}
          <div className="flex flex-col items-center pt-8">
            <div className="relative mb-4">
              <img 
                src={leaderboardData[1].avatar}
                alt={leaderboardData[1].name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-gray-400"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center">
                <Medal className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="font-semibold text-center">{leaderboardData[1].name}</p>
            <p className="text-gray-400 text-sm">{leaderboardData[1].xp.toLocaleString()} XP</p>
            <div className="mt-4 w-full h-24 bg-gradient-to-t from-gray-400/20 to-transparent rounded-t-xl" />
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img 
                src={leaderboardData[0].avatar}
                alt={leaderboardData[0].name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-amber-400"
              />
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="font-bold text-lg text-center">{leaderboardData[0].name}</p>
            <p className="text-amber-400 font-semibold">{leaderboardData[0].xp.toLocaleString()} XP</p>
            <div className="mt-4 w-full h-32 bg-gradient-to-t from-amber-400/20 to-transparent rounded-t-xl" />
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center pt-12">
            <div className="relative mb-4">
              <img 
                src={leaderboardData[2].avatar}
                alt={leaderboardData[2].name}
                className="w-16 h-16 rounded-2xl object-cover border-4 border-amber-700"
              />
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-700 flex items-center justify-center">
                <Medal className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="font-semibold text-center text-sm">{leaderboardData[2].name}</p>
            <p className="text-gray-400 text-sm">{leaderboardData[2].xp.toLocaleString()} XP</p>
            <div className="mt-4 w-full h-16 bg-gradient-to-t from-amber-700/20 to-transparent rounded-t-xl" />
          </div>
        </motion.div>

        {/* Your Rank Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 mb-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                #{currentUser.rank}
              </div>
              <div>
                <p className="font-semibold">Your Ranking</p>
                <p className="text-sm text-gray-400">{currentUser.xp.toLocaleString()} XP earned</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold">{currentUser.streak}</span>
                </div>
                <p className="text-xs text-gray-500">Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-emerald-500">
                  <Target className="w-5 h-5" />
                  <span className="font-bold">{currentUser.problemsSolved}</span>
                </div>
                <p className="text-xs text-gray-500">Solved</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card overflow-hidden"
        >
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-sm font-medium text-gray-500">
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
              className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors ${
                index !== leaderboardData.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <div className="col-span-1">
                <span className={`font-bold ${
                  user.rank === 1 ? 'text-amber-400' :
                  user.rank === 2 ? 'text-gray-400' :
                  user.rank === 3 ? 'text-amber-700' :
                  'text-gray-500'
                }`}>
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
                  <p className="font-medium">{user.name}</p>
                  {user.badge && (
                    <span className={`text-xs ${
                      user.badge === 'crown' ? 'text-amber-400' :
                      user.badge === 'silver' ? 'text-gray-400' :
                      'text-amber-700'
                    }`}>
                      {user.badge === 'crown' ? '👑 Champion' :
                       user.badge === 'silver' ? '🥈 Elite' :
                       '🥉 Pro'}
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-semibold text-indigo-400">{user.xp.toLocaleString()}</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="flex items-center justify-center gap-1 text-orange-500">
                  <Flame className="w-4 h-4" />
                  {user.streak}
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-emerald-500">{user.problemsSolved}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
