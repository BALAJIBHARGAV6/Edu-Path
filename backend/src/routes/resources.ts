import { Router, Request, Response } from 'express'
import Groq from 'groq-sdk'

const router = Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Cache for resources and notes
const resourceCache: Record<string, { data: any; timestamp: number }> = {}
const notesCache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes cache

// Generate comprehensive study notes
router.post('/generate-notes', async (req: Request, res: Response) => {
  const { topic, level = 'intermediate', format = 'detailed' } = req.body

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' })
  }

  // Check cache first
  const cacheKey = `${topic}-${level}-${format}`
  const cached = notesCache[cacheKey]
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json({ notes: cached.data, topic, cached: true })
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert educator. Create concise study notes for ${level} level.
          
Include:
1. Overview (2-3 sentences)
2. Key Concepts (5-7 bullet points)
3. Code Example (if applicable)
4. Best Practices (3-4 points)
5. Common Mistakes (2-3 points)

Use markdown formatting. Be concise but comprehensive.`
        },
        {
          role: 'user',
          content: `Create study notes about: ${topic}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1500
    })

    const notes = completion.choices[0]?.message?.content || ''
    
    // Cache the result
    notesCache[cacheKey] = { data: notes, timestamp: Date.now() }
    
    res.json({ notes, topic })
  } catch (error) {
    console.error('Notes generation error:', error)
    // Return fallback notes
    res.json({ 
      notes: `# ${topic}\n\n## Overview\nThis topic covers important concepts in ${topic}.\n\n## Key Concepts\n- Concept 1\n- Concept 2\n- Concept 3\n\n## Best Practices\n- Follow industry standards\n- Write clean code\n- Test thoroughly`,
      topic,
      fallback: true
    })
  }
})

// Get curated resources for a topic
router.get('/curated/:topic', async (req: Request, res: Response) => {
  const { topic } = req.params

  // Check cache first
  const cached = resourceCache[topic]
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json({ resources: cached.data, cached: true })
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Recommend 4 free learning resources. Return ONLY valid JSON:
{
  "resources": [
    {"type": "video|article|course", "title": "Title", "source": "Platform", "description": "Brief desc", "difficulty": "beginner|intermediate|advanced"}
  ]
}`
        },
        {
          role: 'user',
          content: `Top 4 free resources for: ${topic}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 800,
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0]?.message?.content || ''
    let data
    try {
      data = JSON.parse(content)
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      data = jsonMatch ? JSON.parse(jsonMatch[0]) : { resources: [] }
    }
    
    // Cache the result
    resourceCache[topic] = { data: data.resources, timestamp: Date.now() }
    
    res.json(data)
  } catch (error) {
    console.error('Resource curation error:', error)
    // Return fallback resources
    res.json({ 
      resources: [
        { type: 'video', title: `${topic} Tutorial`, source: 'YouTube', description: 'Comprehensive tutorial', difficulty: 'beginner' },
        { type: 'article', title: `${topic} Guide`, source: 'MDN', description: 'Official documentation', difficulty: 'intermediate' },
        { type: 'course', title: `Learn ${topic}`, source: 'freeCodeCamp', description: 'Free course', difficulty: 'beginner' }
      ],
      fallback: true 
    })
  }
})

// Save resource to user account
router.post('/save', async (req: Request, res: Response) => {
  const { userId, resource } = req.body

  if (!userId || !resource) {
    return res.status(400).json({ error: 'User ID and resource required' })
  }

  // In production, save to database
  res.json({ 
    success: true, 
    message: 'Resource saved',
    resource: { ...resource, savedAt: new Date().toISOString() }
  })
})

// Get saved resources
router.get('/saved/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params

  // In production, fetch from database
  res.json({ resources: [] })
})

// Chat endpoint for AI Learning Assistant
router.post('/chat', async (req: Request, res: Response) => {
  const { message, context = 'general programming' } = req.body

  console.log('Chat request received:', { message: message?.substring(0, 50), context })

  if (!message) {
    return res.status(400).json({ error: 'Message is required', response: 'Please provide a message.' })
  }

  try {
    console.log('Creating Groq completion...')
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert programming tutor and AI learning assistant. You help students learn programming concepts, debug code, and understand best practices.

Your expertise includes:
- All programming languages (JavaScript, Python, Java, C++, etc.)
- Web development (React, Node.js, databases, APIs)
- Computer science fundamentals
- Software engineering best practices
- Debugging and problem-solving

Guidelines:
1. Be concise but thorough
2. Use code examples when helpful
3. Explain concepts step by step
4. Provide practical tips and best practices
5. If asked about code, explain what it does and suggest improvements
6. Be encouraging and supportive

The user is currently learning about: ${context}`
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000
    })

    const response = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again."
    console.log('Groq response received:', response.substring(0, 100))
    
    res.json({ response, success: true })
  } catch (error: any) {
    console.error('Chat error:', error.message || error)
    res.status(500).json({ 
      error: 'Failed to process message',
      response: "I'm having trouble connecting to the AI service right now. Please try again in a moment.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

export default router
