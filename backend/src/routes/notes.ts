import { Router, Request, Response } from 'express';
import { groq } from '../config/groq';

const router = Router();

// Notes cache
const notesCache: Record<string, { data: string; timestamp: number }> = {}
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

// Generate AI notes for a topic
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { topicName, topicDescription, milestoneTitle } = req.body;

    // Check cache
    const cacheKey = `${topicName}-${milestoneTitle || 'general'}`
    const cached = notesCache[cacheKey]
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({ success: true, notes: cached.data, cached: true })
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: `Create concise study notes for: ${topicName}
Include: Key Concepts, How It Works, Best Practices, Common Mistakes (use markdown, be brief)`
        },
        { role: 'user', content: `Notes for: ${topicName}. Context: ${topicDescription || 'programming topic'}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1200,
    });

    const notes = completion.choices[0]?.message?.content || `# ${topicName}\n\nStudy notes for this topic.`;
    
    // Cache the result
    notesCache[cacheKey] = { data: notes, timestamp: Date.now() }

    res.json({ success: true, notes });
  } catch (error) {
    console.error('Error generating notes:', error);
    // Return fallback notes
    res.json({ 
      success: true, 
      notes: `# ${req.body.topicName || 'Topic'}\n\n## Key Concepts\n- Important concept 1\n- Important concept 2\n\n## Best Practices\n- Follow standards\n- Write clean code`,
      fallback: true 
    });
  }
});

export default router;
