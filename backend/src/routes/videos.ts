import { Router, Request, Response } from 'express';

const router = Router();

// Fetch YouTube videos
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ success: false, error: 'Query parameter is required' });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      // Return mock data if no API key
      return res.json({
        success: true,
        videos: [
          {
            videoId: 'mock1',
            title: `${q} - Complete Tutorial`,
            thumbnail: 'https://via.placeholder.com/320x180',
            channelName: 'Tech Academy',
            description: 'A comprehensive tutorial covering all the basics.',
            publishedAt: new Date().toISOString(),
            watched: false,
          },
          {
            videoId: 'mock2',
            title: `Learn ${q} in 2025`,
            thumbnail: 'https://via.placeholder.com/320x180',
            channelName: 'Code Masters',
            description: 'Updated tutorial for modern development.',
            publishedAt: new Date().toISOString(),
            watched: false,
          },
        ],
      });
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        q + ' tutorial'
      )}&type=video&videoDuration=medium&relevanceLanguage=en&maxResults=10&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data: any = await response.json();

    const videos = data.items.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelName: item.snippet.channelTitle,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      watched: false,
    }));

    res.json({ success: true, videos });
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch videos' });
  }
});

export default router;
