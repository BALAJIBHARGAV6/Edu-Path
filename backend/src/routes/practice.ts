import { Router, Request, Response } from 'express'
import Groq from 'groq-sdk'

const router = Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Get practice challenges
router.get('/challenges', async (req: Request, res: Response) => {
  const { category, difficulty, skill } = req.query

  // Sample challenges - in production, fetch from database
  const challenges = [
    { id: 1, title: 'Two Sum', difficulty: 'easy', category: 'algorithms', skills: ['javascript', 'arrays'], points: 10 },
    { id: 2, title: 'Reverse String', difficulty: 'easy', category: 'algorithms', skills: ['javascript', 'strings'], points: 10 },
    { id: 3, title: 'Binary Search', difficulty: 'medium', category: 'algorithms', skills: ['javascript', 'searching'], points: 20 },
    { id: 4, title: 'Build Counter', difficulty: 'easy', category: 'react', skills: ['react', 'hooks'], points: 15 },
    { id: 5, title: 'Fetch API Data', difficulty: 'medium', category: 'react', skills: ['react', 'api'], points: 20 },
    { id: 6, title: 'CSS Flexbox', difficulty: 'easy', category: 'css', skills: ['css', 'flexbox'], points: 10 },
  ]

  let filtered = challenges
  if (category) filtered = filtered.filter(c => c.category === category)
  if (difficulty) filtered = filtered.filter(c => c.difficulty === difficulty)
  if (skill) filtered = filtered.filter(c => c.skills.includes(skill as string))

  res.json({ challenges: filtered })
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

// Get recommended videos from curated channels
router.get('/recommended-videos', async (req: Request, res: Response) => {
  const { skill, category } = req.query

  // Curated educational channels with quality content
  const channels = [
    { name: 'freeCodeCamp', id: 'UC8butISFwT-Wl7EV0hUK0BQ', category: 'fullstack' },
    { name: 'Traversy Media', id: 'UC29ju8bIPH5as8OGnQzwJyA', category: 'frontend' },
    { name: 'The Net Ninja', id: 'UCW5YeuERMmlnqo4oq8vwUpg', category: 'frontend' },
    { name: 'Fireship', id: 'UCsBjURrPoezykLs9EqgamOA', category: 'fullstack' },
    { name: 'Web Dev Simplified', id: 'UCFbNIlppjAuEX4znoulh0Cw', category: 'frontend' },
    { name: 'Programming with Mosh', id: 'UC-T8W79DN6PBnzomelvqJYw', category: 'fullstack' },
    { name: 'Tech With Tim', id: 'UC4JX40jDee_tINbkjycV4Sg', category: 'python' },
    { name: 'Academind', id: 'UCSJbGtTlrDami-tDGPUV9-w', category: 'fullstack' },
  ]

  res.json({ channels })
})

export default router
