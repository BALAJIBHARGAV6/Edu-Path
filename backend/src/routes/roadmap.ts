import { Router, Request, Response } from 'express';
import { groq } from '../config/groq';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Roadmap cache
const roadmapCache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes for roadmaps

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

    // Check cache first
    const cacheKey = `${data.careerGoal}-${data.experienceLevel}-${data.skills.join(',')}`
    const cached = roadmapCache[cacheKey]
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({ success: true, roadmap: cached.data, cached: true })
    }

    const systemPrompt = `You are a career advisor. Create a ${data.experienceLevel} level roadmap for ${data.careerGoal}.

Level: ${data.experienceLevel} - Focus on ${levelInfo.focus}
Skills: ${data.skills.length > 0 ? data.skills.join(', ') : 'None yet'}
Hours/week: ${data.hoursPerWeek}

Return JSON with ${levelInfo.milestoneCount} milestones:
{
  "recommendedPath": "Brief path overview",
  "milestones": [
    {
      "id": 1,
      "title": "Step 1: Title",
      "description": "What you'll learn",
      "skills": ["skill1", "skill2"],
      "estimatedWeeks": 3,
      "status": "current",
      "topics": [{"name": "Topic", "description": "Desc", "isCompleted": false}]
    }
  ]
}

First milestone = "current", others = "locked". Be concise.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Create a ${data.experienceLevel} roadmap for ${data.careerGoal}. Current skills: ${data.skills.join(', ') || 'none'}.`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from AI');
    }

    let roadmapData
    try {
      roadmapData = JSON.parse(responseContent);
    } catch {
      // Fallback roadmap
      roadmapData = {
        recommendedPath: `Your path to becoming a ${data.careerGoal}`,
        milestones: [
          { id: 1, title: 'Step 1: Foundations', description: 'Learn the basics', skills: ['HTML', 'CSS', 'JavaScript'], estimatedWeeks: 4, status: 'current', topics: [{ name: 'Web Basics', description: 'HTML, CSS fundamentals', isCompleted: false }] },
          { id: 2, title: 'Step 2: Core Skills', description: 'Build core competencies', skills: ['React', 'Node.js'], estimatedWeeks: 6, status: 'locked', topics: [{ name: 'Framework Basics', description: 'Learn a framework', isCompleted: false }] },
          { id: 3, title: 'Step 3: Projects', description: 'Build real projects', skills: ['Git', 'Deployment'], estimatedWeeks: 4, status: 'locked', topics: [{ name: 'Portfolio', description: 'Create projects', isCompleted: false }] }
        ]
      }
    }

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

    // Save roadmap to Supabase if user_id is provided
    if (body.user_id) {
      try {
        const { data: savedRoadmap, error: saveError } = await supabaseAdmin
          .from('roadmaps')
          .insert({
            user_id: body.user_id,
            title: `${data.careerGoal} Learning Path`,
            description: roadmapData.recommendedPath,
            ai_generated_path: roadmapData,
          })
          .select()
          .single();

        if (!saveError && savedRoadmap) {
          // Return the saved roadmap with actual database ID
          roadmap.id = savedRoadmap.id;
          roadmap.user_id = savedRoadmap.user_id;
        }
      } catch (saveErr) {
        console.error('Error saving roadmap to database:', saveErr);
        // Continue anyway - return generated roadmap even if save fails
      }
    }

    // Cache the result
    roadmapCache[cacheKey] = { data: roadmap, timestamp: Date.now() }

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
