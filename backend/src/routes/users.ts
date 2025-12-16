import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Create or update user profile
router.post('/profile', async (req: Request, res: Response) => {
  try {
    const { id, fullName, email, careerGoal, experienceLevel, learningStyle, learningPace, hoursPerWeek, preferredContent, skills } = req.body;

    console.log('Creating/updating profile for user:', id);
    console.log('Profile data:', { fullName, email, careerGoal, experienceLevel, learningStyle, hoursPerWeek });

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

    if (error) {
      console.error('Error upserting profile:', error);
      throw error;
    }

    console.log('Profile saved successfully:', data.id);

    // Save skills to user_skills table
    if (skills && Array.isArray(skills) && skills.length > 0) {
      console.log('Saving skills:', skills);
      
      // First, delete existing skills for this user
      const { error: deleteError } = await supabaseAdmin
        .from('user_skills')
        .delete()
        .eq('user_id', id);

      if (deleteError) {
        console.error('Error deleting old skills:', deleteError);
      }

      // Then insert new skills
      const skillsToInsert = skills.map(skill => ({
        user_id: id,
        skill_name: skill,
        proficiency_level: experienceLevel || 'beginner',
      }));

      const { error: skillsError } = await supabaseAdmin
        .from('user_skills')
        .insert(skillsToInsert);

      if (skillsError) {
        console.error('Error saving skills:', skillsError);
        // Don't fail the request if skills save fails
      } else {
        console.log('Skills saved successfully:', skills.length);
      }
    }

    res.json({ success: true, profile: data });
  } catch (error: any) {
    console.error('Error saving profile:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save profile',
      details: error.message || error.toString()
    });
  }
});

// Get user profile
router.get('/profile/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Get user profile
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Get user skills from user_skills table
    const { data: skills, error: skillsError } = await supabaseAdmin
      .from('user_skills')
      .select('skill_name')
      .eq('user_id', userId);

    if (skillsError) {
      console.error('Error fetching skills:', skillsError);
    }

    // Add skills array to profile
    const profileWithSkills = {
      ...profile,
      skills: skills ? skills.map(s => s.skill_name) : []
    };

    res.json({ success: true, profile: profileWithSkills });
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

    // Delete existing skills
    await supabaseAdmin
      .from('user_skills')
      .delete()
      .eq('user_id', userId);

    // Insert new skills if provided
    if (skills && Array.isArray(skills) && skills.length > 0) {
      const skillsToInsert = skills.map(skill => ({
        user_id: userId,
        skill_name: skill,
        proficiency_level: 'beginner',
      }));

      const { error: insertError } = await supabaseAdmin
        .from('user_skills')
        .insert(skillsToInsert);

      if (insertError) throw insertError;
    }

    // Get updated skills
    const { data: updatedSkills, error: fetchError } = await supabaseAdmin
      .from('user_skills')
      .select('skill_name')
      .eq('user_id', userId);

    if (fetchError) throw fetchError;

    res.json({ 
      success: true, 
      profile: { 
        skills: updatedSkills ? updatedSkills.map(s => s.skill_name) : [] 
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
