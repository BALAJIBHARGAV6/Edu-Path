import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Create or update user profile - OPTIMIZED
router.post('/profile', async (req: Request, res: Response) => {
  try {
    const { id, fullName, email, careerGoal, experienceLevel, learningStyle, learningPace, hoursPerWeek, preferredContent, skills } = req.body;

    // Upsert user profile
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        id,
        full_name: fullName || '',
        email,
        career_goal: careerGoal,
        experience_level: experienceLevel,
        learning_style: learningStyle,
        learning_pace: learningPace,
        hours_per_week: hoursPerWeek,
        preferred_content: preferredContent || ['videos', 'articles'],
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) throw error;

    // Handle skills update asynchronously - don't block response
    if (skills && Array.isArray(skills) && skills.length > 0) {
      // Fire and forget - let skills update in background
      setImmediate(async () => {
        try {
          // Delete old skills and insert new ones
          await supabaseAdmin.from('user_skills').delete().eq('user_id', id);
          
          const skillsToInsert = skills.map(skill => ({
            user_id: id,
            skill_name: skill,
            proficiency_level: experienceLevel || 'beginner',
          }));
          
          await supabaseAdmin.from('user_skills').insert(skillsToInsert);
        } catch (err) {
          console.error('Background skills update error:', err);
        }
      });
    }

    // Return immediately without waiting for skills
    res.json({ success: true, profile: data });
  } catch (error: any) {
    console.error('Profile save error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save profile'
    });
  }
});

// Get user profile - OPTIMIZED for speed
router.get('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // PARALLEL queries for maximum speed - fetch profile and skills simultaneously
    const [profileResult, skillsResult] = await Promise.all([
      supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(),
      supabaseAdmin
        .from('user_skills')
        .select('skill_name')
        .eq('user_id', userId)
    ]);

    if (profileResult.error) throw profileResult.error;
    
    if (!profileResult.data) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    // Combine results - skills query errors are non-fatal
    const profileWithSkills = {
      ...profileResult.data,
      skills: skillsResult.data ? skillsResult.data.map(s => s.skill_name) : []
    };

    // Cache for 30 seconds to reduce database load
    res.set('Cache-Control', 'private, max-age=30');
    res.json({ success: true, profile: profileWithSkills });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
});

// Update user skills in profile - OPTIMIZED
router.put('/profile/:userId/skills', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { skills } = req.body;

    // Delete and insert in background, return immediately
    setImmediate(async () => {
      try {
        await supabaseAdmin.from('user_skills').delete().eq('user_id', userId);
        
        if (skills && Array.isArray(skills) && skills.length > 0) {
          const skillsToInsert = skills.map(skill => ({
            user_id: userId,
            skill_name: skill,
            proficiency_level: 'beginner',
          }));
          await supabaseAdmin.from('user_skills').insert(skillsToInsert);
        }
      } catch (err) {
        console.error('Background skills update error:', err);
      }
    });

    // Return immediately with the skills the user sent (optimistic response)
    res.json({ 
      success: true, 
      profile: { 
        skills: skills || [] 
      } 
    });
  } catch (error) {
    console.error('Error updating skills:', error);
    res.status(500).json({ success: false, error: 'Failed to update skills' });
  }
});

// Get user stats for profile
router.get('/stats/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Get comprehensive user statistics
    const [profile, progress, achievements, sessions] = await Promise.all([
      supabaseAdmin.from('user_profiles').select('*').eq('id', userId).single(),
      supabaseAdmin.from('user_progress').select('*').eq('user_id', userId),
      supabaseAdmin.from('user_achievements').select('*, achievements(*)').eq('user_id', userId),
      supabaseAdmin.from('learning_sessions').select('duration_seconds').eq('user_id', userId)
    ]);

    const completedTopics = progress.data?.filter((p: any) => p.watched).length || 0;
    const totalStudyTime = sessions.data?.reduce((sum: number, s: any) => sum + (s.duration_seconds || 0), 0) || 0;
    const xp = (completedTopics * 50) + (achievements.data?.length || 0) * 100 + (profile.data?.streak_count || 0) * 10;

    res.json({
      success: true,
      stats: {
        xp,
        streak: profile.data?.streak_count || 0,
        completedTopics,
        totalStudyTime: Math.round(totalStudyTime / 60), // in minutes
        achievements: achievements.data || [],
        rank: 'Calculating...', // Would need to query all users to calculate
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

export default router;
