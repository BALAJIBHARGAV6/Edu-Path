import { Router, Request, Response } from 'express';
import { groq } from '../config/groq';

const router = Router();

// Generate AI notes for a topic
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { topicName, topicDescription, milestoneTitle } = req.body;

    const systemPrompt = `You are an expert educator creating comprehensive study notes. Generate detailed, well-structured notes for the following topic.

Topic: ${topicName}
Description: ${topicDescription}
Part of: ${milestoneTitle}

Create notes that include:
1. **Key Concepts** - Main ideas and definitions
2. **How It Works** - Explanation of the core mechanics
3. **Best Practices** - Industry-standard approaches
4. **Common Mistakes** - What to avoid
5. **Quick Tips** - Practical advice for learning
6. **Practice Ideas** - Hands-on exercises to try

Format the notes in a clear, readable way with headers and bullet points. Keep it concise but comprehensive. Use markdown formatting.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate comprehensive study notes for: ${topicName}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000,
    });

    const notes = completion.choices[0]?.message?.content;
    
    if (!notes) {
      throw new Error('No notes generated');
    }

    res.json({ success: true, notes });
  } catch (error) {
    console.error('Error generating notes:', error);
    res.status(500).json({ success: false, error: 'Failed to generate notes' });
  }
});

export default router;
