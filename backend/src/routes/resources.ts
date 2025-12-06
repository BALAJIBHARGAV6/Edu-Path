import { Router, Request, Response } from 'express'
import Groq from 'groq-sdk'

const router = Router()
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Generate comprehensive study notes
router.post('/generate-notes', async (req: Request, res: Response) => {
  const { topic, level = 'intermediate', format = 'detailed' } = req.body

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' })
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert technical educator. Create comprehensive, well-structured study notes.
          Level: ${level}
          Format: ${format}
          
          Include:
          1. Overview/Introduction
          2. Key Concepts (with clear explanations)
          3. Code Examples (if applicable)
          4. Best Practices
          5. Common Mistakes to Avoid
          6. Practice Exercises
          7. Further Reading Resources
          
          Use markdown formatting with headers, bullet points, and code blocks.`
        },
        {
          role: 'user',
          content: `Create detailed study notes about: ${topic}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000
    })

    const notes = completion.choices[0]?.message?.content || ''
    res.json({ notes, topic })
  } catch (error) {
    console.error('Notes generation error:', error)
    res.status(500).json({ error: 'Failed to generate notes' })
  }
})

// Get curated resources for a topic
router.get('/curated/:topic', async (req: Request, res: Response) => {
  const { topic } = req.params

  // In production, this would query a database of curated resources
  // For now, return structured recommendations
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a learning resource curator. Recommend the best free learning resources.
          Return ONLY valid JSON in this format:
          {
            "resources": [
              {
                "type": "video|article|course|documentation",
                "title": "Resource title",
                "source": "Platform name",
                "url": "URL or search query",
                "description": "Brief description",
                "difficulty": "beginner|intermediate|advanced",
                "duration": "Estimated time"
              }
            ]
          }`
        },
        {
          role: 'user',
          content: `Recommend the top 6 free learning resources for: ${topic}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1500
    })

    const content = completion.choices[0]?.message?.content || ''
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0])
      res.json(data)
    } else {
      res.json({ resources: [] })
    }
  } catch (error) {
    console.error('Resource curation error:', error)
    res.status(500).json({ error: 'Failed to get resources' })
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

export default router
