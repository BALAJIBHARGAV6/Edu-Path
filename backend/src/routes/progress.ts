import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

const router = Router();

// Update topic completion
router.post('/topic', async (req: Request, res: Response) => {
  try {
    const { userId, topicId, isCompleted } = req.body;

    const { data, error } = await supabaseAdmin
      .from('topics')
      .update({ 
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null 
      })
      .eq('id', topicId)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, topic: data });
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ success: false, error: 'Failed to update topic' });
  }
});

// Track video watch progress
router.post('/video', async (req: Request, res: Response) => {
  try {
    const { userId, topicId, videoId, watched, watchTime } = req.body;

    const { data, error } = await supabaseAdmin
      .from('user_progress')
      .upsert({
        user_id: userId,
        topic_id: topicId,
        video_id: videoId,
        watched,
        watch_time: watchTime,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, progress: data });
  } catch (error) {
    console.error('Error tracking video:', error);
    res.status(500).json({ success: false, error: 'Failed to track video' });
  }
});

// Get user progress summary
router.get('/summary/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const { data: progress, error } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    const totalVideos = progress?.length || 0;
    const watchedVideos = progress?.filter(p => p.watched).length || 0;
    const totalWatchTime = progress?.reduce((acc, p) => acc + (p.watch_time || 0), 0) || 0;

    res.json({
      success: true,
      summary: {
        totalVideos,
        watchedVideos,
        totalWatchTime,
        completionRate: totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch progress' });
  }
});

export default router;
