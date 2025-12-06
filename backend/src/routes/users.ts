import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Create or update user profile
router.post('/profile', async (req: Request, res: Response) => {
  try {
    const { id, fullName, email, careerGoal, experienceLevel, learningStyle, learningPace, hoursPerWeek, preferredContent } = req.body;

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

// Save user skills
router.post('/skills', async (req: Request, res: Response) => {
  try {
    const { userId, skills } = req.body;

    // Delete existing skills
    await supabaseAdmin.from('user_skills').delete().eq('user_id', userId);

    // Insert new skills
    const skillRecords = skills.map((skill: string) => ({
      user_id: userId,
      skill_name: skill,
      proficiency_level: 'beginner',
    }));

    const { data, error } = await supabaseAdmin
      .from('user_skills')
      .insert(skillRecords)
      .select();

    if (error) throw error;

    res.json({ success: true, skills: data });
  } catch (error) {
    console.error('Error saving skills:', error);
    res.status(500).json({ success: false, error: 'Failed to save skills' });
  }
});

export default router;
