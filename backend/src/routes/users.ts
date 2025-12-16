import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Create or update user profile
router.post('/profile', async (req: Request, res: Response) => {
  try {
    const { id, fullName, email, careerGoal, experienceLevel, learningStyle, learningPace, hoursPerWeek, preferredContent, skills } = req.body;

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        id,
        full_name: fullName,
        email,
        career_goal: careerGoal,
        experience_level: experienceLevel,
        learning_style: learningStyle,
        learning_pace: learningPace,
        hours_per_week: hoursPerWeek,
        preferred_content: preferredContent,
        skills: skills || [],
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, profile: data });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ success: false, error: 'Failed to save profile' });
  }
});

// Get user profile
router.get('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    res.json({ success: true, profile: data });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
});

// Update user skills in profile
router.put('/profile/:userId/skills', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { skills } = req.body;

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update({ skills, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, profile: data });
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
