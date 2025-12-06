import { Router, Request, Response } from 'express';
import { groq } from '../config/groq';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

interface GenerateRoadmapBody {
  fullName: string;
  email: string;
  careerGoal: string;
  learningStyle: string;
  skills: string[];
  experienceLevel: string;
  learningPace: string;
  hoursPerWeek: number;
  preferredContent: string[];
}

// Generate AI-powered roadmap
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    
    // Set defaults for missing fields
    const data: GenerateRoadmapBody = {
      fullName: body.fullName || 'User',
      email: body.email || '',
      careerGoal: body.careerGoal || 'Full Stack Developer',
      learningStyle: body.learningStyle || 'mixed',
      skills: body.skills || [],
      experienceLevel: body.experienceLevel || 'beginner',
      learningPace: body.learningPace || 'moderate',
      hoursPerWeek: body.hoursPerWeek || 10,
      preferredContent: body.preferredContent || ['videos', 'articles', 'projects']
    };

    const levelConfig = {
      beginner: {
        focus: 'fundamentals and basics',
        milestoneCount: '6-8',
        complexity: 'Start from absolute basics, no prior knowledge assumed',
        examples: 'HTML basics, CSS fundamentals, JavaScript intro, basic DOM manipulation'
      },
      intermediate: {
        focus: 'frameworks, tools, and best practices', 
        milestoneCount: '5-7',
        complexity: 'Assumes basic knowledge, focus on practical frameworks and tools',
        examples: 'React/Vue, State management, APIs, Testing, Build tools'
      },
      advanced: {
        focus: 'architecture, optimization, and expert-level concepts',
        milestoneCount: '4-6', 
        complexity: 'Expert level topics, system design, performance optimization',
        examples: 'System design, Performance optimization, Security, CI/CD, Microservices'
      }
    };
    
    const levelInfo = levelConfig[data.experienceLevel as keyof typeof levelConfig] || levelConfig.beginner;

    const systemPrompt = `You are an expert career advisor creating a ${data.experienceLevel.toUpperCase()} level learning roadmap for ${data.careerGoal}.

IMPORTANT: This is a ${data.experienceLevel} level path. Generate content specifically for this level:
- Focus: ${levelInfo.focus}
- Complexity: ${levelInfo.complexity}
- Example topics for this level: ${levelInfo.examples}

User Profile:
- Name: ${data.fullName}
- Current Skills: ${data.skills.length > 0 ? data.skills.join(', ') : 'Starting fresh'}
- Experience Level: ${data.experienceLevel}
- Career Goal: ${data.careerGoal}
- Hours per Week: ${data.hoursPerWeek}

Create a SEQUENTIAL learning roadmap with ${levelInfo.milestoneCount} milestones that build upon each other.
Each milestone should be a clear step in the learning journey.

Return response in this exact JSON format:
{
  "recommendedPath": "Brief overview of this ${data.experienceLevel} path",
  "milestones": [
    {
      "id": 1,
      "title": "Step 1: [Clear Title]",
      "description": "What you'll master in this step",
      "skills": ["skill1", "skill2", "skill3"],
      "estimatedWeeks": 3,
      "status": "current",
      "topics": [
        {
          "name": "Specific Topic",
          "description": "Detailed description",
          "isCompleted": false
        }
      ]
    },
    {
      "id": 2,
      "title": "Step 2: [Clear Title]",
      "description": "Next step building on Step 1",
      "skills": ["skill1", "skill2"],
      "estimatedWeeks": 4,
      "status": "locked",
      "topics": []
    }
  ]
}

CRITICAL REQUIREMENTS:
1. Generate EXACTLY ${levelInfo.milestoneCount} milestones for ${data.experienceLevel} level
2. Each milestone must be UNIQUE and SEQUENTIAL (Step 1, Step 2, etc.)
3. Content must match ${data.experienceLevel} complexity - ${levelInfo.complexity}
4. First milestone status = "current", all others = "locked"
5. Include realistic estimatedWeeks based on ${data.hoursPerWeek} hours/week
6. Topics should be specific to ${data.careerGoal} at ${data.experienceLevel} level
7. DO NOT repeat the same topics across different levels`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Generate a personalized learning roadmap for me to become a ${data.careerGoal}. I currently know: ${data.skills.join(', ')}. I am at ${data.experienceLevel} level and can dedicate ${data.hoursPerWeek} hours per week.`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from AI');
    }

    const roadmapData = JSON.parse(responseContent);

    // Create roadmap object
    const roadmap = {
      id: Date.now(),
      user_id: data.email,
      title: `${data.careerGoal} Learning Path`,
      description: roadmapData.recommendedPath,
      ai_generated_path: roadmapData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    res.json({ success: true, roadmap });
  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ success: false, error: 'Failed to generate roadmap' });
  }
});

// Get user's roadmaps
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabaseAdmin
      .from('roadmaps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, roadmaps: data });
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch roadmaps' });
  }
});

// Update milestone status
router.patch('/milestone/:milestoneId', async (req: Request, res: Response) => {
  try {
    const { milestoneId } = req.params;
    const { status } = req.body;

    const { data, error } = await supabaseAdmin
      .from('milestones')
      .update({ status, completed_at: status === 'completed' ? new Date().toISOString() : null })
      .eq('id', milestoneId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, milestone: data });
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ success: false, error: 'Failed to update milestone' });
  }
});

export default router;
