import { Router, Request, Response } from 'express';

const router = Router();

// Invidious public instances (YouTube mirrors - no API key needed)
const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.nerdvpn.de',
  'https://invidious.jing.rocks',
  'https://vid.puffyan.us'
];

// Get a working Invidious instance
async function getWorkingInstance(): Promise<string | null> {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const response = await fetch(`${instance}/api/v1/stats`, { 
        signal: AbortSignal.timeout(3000) 
      });
      if (response.ok) return instance;
    } catch {
      continue;
    }
  }
  return null;
}

// Fetch YouTube videos using Invidious API (no API key needed)
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { query, q } = req.query;
    const searchQuery = (query || q) as string;

    if (!searchQuery || typeof searchQuery !== 'string') {
      return res.status(400).json({ success: false, error: 'Query parameter is required' });
    }

    // Try YouTube API first if key exists
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            searchQuery + ' tutorial'
          )}&type=video&videoDuration=medium&relevanceLanguage=en&maxResults=10&key=${apiKey}`
        );

        if (response.ok) {
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
          return res.json({ success: true, videos });
        }
      } catch (err) {
        console.log('YouTube API failed, falling back to Invidious');
      }
    }

    // Use Invidious API (no API key required)
    const instance = await getWorkingInstance();
    
    if (instance) {
      const searchUrl = `${instance}/api/v1/search?q=${encodeURIComponent(searchQuery + ' tutorial')}&type=video`;
      const response = await fetch(searchUrl, { 
        signal: AbortSignal.timeout(10000) 
      });
      
      if (response.ok) {
        const data: any = await response.json();
        const videos = data.slice(0, 10).map((item: any) => ({
          videoId: item.videoId,
          title: item.title,
          thumbnail: item.videoThumbnails?.[3]?.url || `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`,
          channelName: item.author,
          description: item.description || '',
          publishedAt: new Date(item.published * 1000).toISOString(),
          watched: false,
          viewCount: item.viewCount,
          lengthSeconds: item.lengthSeconds
        }));
        return res.json({ success: true, videos, source: 'invidious' });
      }
    }

    // Final fallback: Generate curated educational video links based on topic
    const curatedVideos = generateCuratedVideos(searchQuery);
    return res.json({ success: true, videos: curatedVideos, source: 'curated' });

  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch videos' });
  }
});

// Generate curated educational videos based on topic (real YouTube video IDs)
function generateCuratedVideos(topic: string): any[] {
  const topicLower = topic.toLowerCase();
  
  // Real popular educational YouTube videos for common programming topics
  const videoDatabase: Record<string, any[]> = {
    javascript: [
      { videoId: 'W6NZfCO5SIk', title: 'JavaScript Tutorial for Beginners - Full Course', channelName: 'Programming with Mosh', thumbnail: 'https://i.ytimg.com/vi/W6NZfCO5SIk/mqdefault.jpg' },
      { videoId: 'PkZNo7MFNFg', title: 'Learn JavaScript - Full Course for Beginners', channelName: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg' },
      { videoId: 'hdI2bqOjy3c', title: 'JavaScript Crash Course For Beginners', channelName: 'Traversy Media', thumbnail: 'https://i.ytimg.com/vi/hdI2bqOjy3c/mqdefault.jpg' },
      { videoId: 'jS4aFq5-91M', title: 'JavaScript Programming - Full Course', channelName: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/jS4aFq5-91M/mqdefault.jpg' },
    ],
    react: [
      { videoId: 'bMknfKXIFA8', title: 'React Course - Beginner Tutorial for React', channelName: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/bMknfKXIFA8/mqdefault.jpg' },
      { videoId: 'w7ejDZ8SWv8', title: 'React JS Crash Course', channelName: 'Traversy Media', thumbnail: 'https://i.ytimg.com/vi/w7ejDZ8SWv8/mqdefault.jpg' },
      { videoId: 'Ke90Tje7VS0', title: 'React JS - React Tutorial for Beginners', channelName: 'Programming with Mosh', thumbnail: 'https://i.ytimg.com/vi/Ke90Tje7VS0/mqdefault.jpg' },
      { videoId: 'LDB4uaJ87e0', title: 'React Hooks Tutorial', channelName: 'Fireship', thumbnail: 'https://i.ytimg.com/vi/LDB4uaJ87e0/mqdefault.jpg' },
    ],
    python: [
      { videoId: '_uQrJ0TkZlc', title: 'Python Tutorial - Python Full Course for Beginners', channelName: 'Programming with Mosh', thumbnail: 'https://i.ytimg.com/vi/_uQrJ0TkZlc/mqdefault.jpg' },
      { videoId: 'rfscVS0vtbw', title: 'Learn Python - Full Course for Beginners', channelName: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/mqdefault.jpg' },
      { videoId: 'XKHEtdqhLK8', title: 'Python Crash Course For Beginners', channelName: 'Traversy Media', thumbnail: 'https://i.ytimg.com/vi/XKHEtdqhLK8/mqdefault.jpg' },
      { videoId: 'kqtD5dpn9C8', title: 'Python for Beginners - Learn Python in 1 Hour', channelName: 'Programming with Mosh', thumbnail: 'https://i.ytimg.com/vi/kqtD5dpn9C8/mqdefault.jpg' },
    ],
    typescript: [
      { videoId: 'BwuLxPH8IDs', title: 'TypeScript Course for Beginners - Learn TypeScript', channelName: 'Academind', thumbnail: 'https://i.ytimg.com/vi/BwuLxPH8IDs/mqdefault.jpg' },
      { videoId: 'gp5H0Vw39yw', title: 'Learn TypeScript - Full Tutorial', channelName: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/gp5H0Vw39yw/mqdefault.jpg' },
      { videoId: 'BCg4U1FzODs', title: 'TypeScript Crash Course', channelName: 'Traversy Media', thumbnail: 'https://i.ytimg.com/vi/BCg4U1FzODs/mqdefault.jpg' },
    ],
    nodejs: [
      { videoId: 'TlB_eWDSMt4', title: 'Node.js Crash Course', channelName: 'Traversy Media', thumbnail: 'https://i.ytimg.com/vi/TlB_eWDSMt4/mqdefault.jpg' },
      { videoId: 'Oe421EPjeBE', title: 'Node.js and Express.js - Full Course', channelName: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/Oe421EPjeBE/mqdefault.jpg' },
      { videoId: 'ENrzD9HAZK4', title: 'Node.js Ultimate Beginners Guide', channelName: 'Fireship', thumbnail: 'https://i.ytimg.com/vi/ENrzD9HAZK4/mqdefault.jpg' },
    ],
    css: [
      { videoId: 'OXGznpKZ_sA', title: 'CSS Tutorial - Zero to Hero', channelName: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/OXGznpKZ_sA/mqdefault.jpg' },
      { videoId: 'yfoY53QXEnI', title: 'CSS Crash Course For Absolute Beginners', channelName: 'Traversy Media', thumbnail: 'https://i.ytimg.com/vi/yfoY53QXEnI/mqdefault.jpg' },
      { videoId: '1PnVor36_40', title: 'Learn CSS in 20 Minutes', channelName: 'Web Dev Simplified', thumbnail: 'https://i.ytimg.com/vi/1PnVor36_40/mqdefault.jpg' },
    ],
    html: [
      { videoId: 'pQN-pnXPaVg', title: 'HTML Full Course - Build a Website Tutorial', channelName: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/pQN-pnXPaVg/mqdefault.jpg' },
      { videoId: 'UB1O30fR-EE', title: 'HTML Crash Course For Absolute Beginners', channelName: 'Traversy Media', thumbnail: 'https://i.ytimg.com/vi/UB1O30fR-EE/mqdefault.jpg' },
      { videoId: 'qz0aGYrrlhU', title: 'HTML Tutorial for Beginners', channelName: 'Programming with Mosh', thumbnail: 'https://i.ytimg.com/vi/qz0aGYrrlhU/mqdefault.jpg' },
    ],
    'full stack': [
      { videoId: 'nu_pCVPKzTk', title: 'Full Stack Web Development Course', channelName: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/nu_pCVPKzTk/mqdefault.jpg' },
      { videoId: 'mrHNSanmqQ4', title: 'MERN Stack Tutorial', channelName: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/mrHNSanmqQ4/mqdefault.jpg' },
    ],
    default: [
      { videoId: 'PkZNo7MFNFg', title: 'Learn JavaScript - Full Course', channelName: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg' },
      { videoId: 'bMknfKXIFA8', title: 'React Course - Beginner Tutorial', channelName: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/bMknfKXIFA8/mqdefault.jpg' },
      { videoId: 'rfscVS0vtbw', title: 'Learn Python - Full Course', channelName: 'freeCodeCamp.org', thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/mqdefault.jpg' },
    ]
  };

  // Find matching videos
  let videos = videoDatabase.default;
  for (const [key, vids] of Object.entries(videoDatabase)) {
    if (topicLower.includes(key) || key.includes(topicLower)) {
      videos = vids;
      break;
    }
  }

  return videos.map((v, i) => ({
    ...v,
    description: `Learn ${topic} with this comprehensive tutorial`,
    publishedAt: new Date().toISOString(),
    watched: false,
  }));
}

export default router;
