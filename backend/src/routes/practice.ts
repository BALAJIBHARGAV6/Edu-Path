import { Router, Request, Response } from 'express'
import Groq from 'groq-sdk'
import { supabaseAdmin } from '../config/supabase'

const router = Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Simple in-memory cache for challenges
const challengeCache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes cache

// Generate AI practice challenges
router.get('/challenges', async (req: Request, res: Response) => {
  const { category, difficulty, skill, count = 6 } = req.query
  const categoryFilter = category || skill || 'programming'
  const difficultyFilter = difficulty || 'mixed'
  
  // Check cache first
  const cacheKey = `${categoryFilter}-${difficultyFilter}-${count}`
  const cached = challengeCache[cacheKey]
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json({ success: true, challenges: cached.data, cached: true })
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert programming educator. Generate ${count} coding practice challenges.
          Category: ${categoryFilter}
          Difficulty: ${difficultyFilter}
          
          Return ONLY valid JSON in this format:
          {
            "challenges": [
              {
                "id": 1,
                "title": "Challenge Title",
                "difficulty": "easy|medium|hard",
                "category": "${categoryFilter}",
                "desc": "Brief description",
                "acceptance": 75,
                "skills": ["skill1", "skill2"],
                "points": 10-50
              }
            ]
          }`
        },
        {
          role: 'user',
          content: `Generate ${count} ${difficultyFilter} level coding challenges for ${categoryFilter}. Keep descriptions brief.`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0]?.message?.content || ''
    
    let data
    try {
      data = JSON.parse(content)
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Invalid response format')
      }
    }
    
    // Cache the result
    challengeCache[cacheKey] = { data: data.challenges, timestamp: Date.now() }
    
    res.json({ success: true, challenges: data.challenges })
  } catch (error) {
    console.error('Challenge generation error:', error)
    
    // Return fallback challenges if AI fails
    const fallbackChallenges = [
      { id: 1, title: 'Two Sum', difficulty: 'easy', category: categoryFilter, desc: 'Find two numbers that add up to target', acceptance: 85, skills: [categoryFilter], points: 10 },
      { id: 2, title: 'Reverse String', difficulty: 'easy', category: categoryFilter, desc: 'Reverse a given string', acceptance: 90, skills: [categoryFilter], points: 10 },
      { id: 3, title: 'Palindrome Check', difficulty: 'easy', category: categoryFilter, desc: 'Check if string is palindrome', acceptance: 80, skills: [categoryFilter], points: 15 },
      { id: 4, title: 'FizzBuzz', difficulty: 'easy', category: categoryFilter, desc: 'Classic FizzBuzz problem', acceptance: 95, skills: [categoryFilter], points: 10 },
      { id: 5, title: 'Array Max', difficulty: 'easy', category: categoryFilter, desc: 'Find maximum in array', acceptance: 88, skills: [categoryFilter], points: 10 },
      { id: 6, title: 'Count Vowels', difficulty: 'easy', category: categoryFilter, desc: 'Count vowels in string', acceptance: 82, skills: [categoryFilter], points: 10 }
    ]
    
    res.json({ success: true, challenges: fallbackChallenges, fallback: true })
  }
})

// Generate AI test for a topic
router.post('/generate-test', async (req: Request, res: Response) => {
  const { topic, difficulty = 'medium', questionCount = 5 } = req.body

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' })
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert educator. Generate a quiz with ${questionCount} multiple choice questions about the given topic. 
          Difficulty: ${difficulty}
          Return ONLY valid JSON in this format:
          {
            "title": "Quiz title",
            "questions": [
              {
                "id": 1,
                "question": "Question text",
                "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
                "correct": 0,
                "explanation": "Why this is correct"
              }
            ]
          }`
        },
        {
          role: 'user',
          content: `Generate a ${difficulty} quiz about: ${topic}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000
    })

    const content = completion.choices[0]?.message?.content || ''
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      const test = JSON.parse(jsonMatch[0])
      res.json({ test })
    } else {
      throw new Error('Invalid response format')
    }
  } catch (error) {
    console.error('Test generation error:', error)
    res.status(500).json({ error: 'Failed to generate test' })
  }
})

// Evaluate test answers and adjust path
router.post('/evaluate-test', async (req: Request, res: Response) => {
  const { answers, questions, userId, roadmapId } = req.body

  if (!answers || !questions) {
    return res.status(400).json({ error: 'Answers and questions required' })
  }

  let correct = 0
  const results = questions.map((q: any, i: number) => {
    const isCorrect = answers[i] === q.correct
    if (isCorrect) correct++
    return {
      questionId: q.id,
      userAnswer: answers[i],
      correctAnswer: q.correct,
      isCorrect,
      explanation: q.explanation
    }
  })

  const score = Math.round((correct / questions.length) * 100)
  
  // Determine path adjustment
  let adjustment = 'maintain'
  let feedback = ''
  
  if (score >= 90) {
    adjustment = 'accelerate'
    feedback = 'Excellent! You can skip ahead to more advanced topics.'
  } else if (score >= 70) {
    adjustment = 'maintain'
    feedback = 'Good job! Continue with your current pace.'
  } else if (score >= 50) {
    adjustment = 'remediate'
    feedback = 'Review the material and try again. Focus on weak areas.'
  } else {
    adjustment = 'remediate'
    feedback = 'Consider revisiting the fundamentals before moving forward.'
  }

  res.json({
    score,
    correct,
    total: questions.length,
    results,
    adjustment,
    feedback,
    passed: score >= 70
  })
})

// Submit challenge solution and evaluate
router.post('/submit-solution', async (req: Request, res: Response) => {
  const { userId, challengeId, code, language } = req.body

  if (!challengeId || !code) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // Use AI to evaluate the solution
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Evaluate this code. Return JSON:
{
  "passed": true|false,
  "score": 0-100,
  "feedback": "Brief feedback",
  "strengths": ["str1"],
  "improvements": ["imp1"],
  "efficiency": "O(n)",
  "testsPassed": 8,
  "testsTotal": 10
}`
        },
        {
          role: 'user',
          content: `${language} code:\n${code}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 800,
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0]?.message?.content || ''
    
    let evaluation
    try {
      // Try to parse the response directly
      evaluation = JSON.parse(content)
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0])
      } else {
        // Fallback evaluation if AI response is malformed
        evaluation = {
          passed: false,
          score: 50,
          feedback: 'Code received. Unable to fully analyze. Please try again.',
          strengths: ['Code submitted successfully'],
          improvements: ['Consider adding comments', 'Add error handling'],
          efficiency: 'Unable to determine',
          testsPassed: 0,
          testsTotal: 5
        }
      }
    }
    
    // Ensure all required fields exist
    evaluation = {
      passed: evaluation.passed ?? false,
      score: evaluation.score ?? 50,
      feedback: evaluation.feedback ?? 'Evaluation complete',
      strengths: evaluation.strengths ?? [],
      improvements: evaluation.improvements ?? [],
      efficiency: evaluation.efficiency ?? 'N/A',
      testsPassed: evaluation.testsPassed ?? 0,
      testsTotal: evaluation.testsTotal ?? 5
    }

    // Save to database if user is logged in
    if (userId && userId !== 'anonymous') {
      try {
        await supabaseAdmin.from('user_progress').upsert({
          user_id: userId,
          topic_id: parseInt(challengeId) || 1,
          watched: evaluation.passed,
          notes: JSON.stringify(evaluation),
          updated_at: new Date().toISOString()
        })
      } catch (dbError) {
        console.log('Database save skipped:', dbError)
      }
    }

    res.json({ success: true, evaluation })
  } catch (error) {
    console.error('Solution evaluation error:', error)
    res.status(500).json({ success: false, error: 'Failed to evaluate solution' })
  }
})

// Get leaderboard data with real-time calculations
router.get('/leaderboard', async (req: Request, res: Response) => {
  const { timeFrame = 'alltime', limit = 50 } = req.query

  try {
    let dateFilter = ''
    const now = new Date()
    
    if (timeFrame === 'weekly') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      dateFilter = weekAgo.toISOString()
    } else if (timeFrame === 'monthly') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      dateFilter = monthAgo.toISOString()
    }

    // Get user stats from database
    let query = supabaseAdmin
      .from('user_profiles')
      .select(`
        id,
        full_name,
        avatar_url,
        streak_count,
        user_progress(count),
        user_achievements(count)
      `)
      .order('streak_count', { ascending: false })
      .limit(parseInt(limit as string))

    if (dateFilter) {
      query = query.gte('last_activity_date', dateFilter)
    }

    const { data: users, error } = await query

    if (error) throw error

    // Calculate XP and rank
    const leaderboard = users?.map((user: any, index: number) => {
      const problemsSolved = user.user_progress?.[0]?.count || 0
      const achievements = user.user_achievements?.[0]?.count || 0
      const xp = (problemsSolved * 50) + (achievements * 100) + (user.streak_count * 10)

      return {
        rank: index + 1,
        name: user.full_name || 'Anonymous',
        avatar: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
        xp,
        streak: user.streak_count || 0,
        problemsSolved,
        achievements,
        badge: index === 0 ? 'crown' : index === 1 ? 'silver' : index === 2 ? 'bronze' : null
      }
    }) || []

    res.json({ success: true, leaderboard })
  } catch (error) {
    console.error('Leaderboard error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' })
  }
})

export default router
