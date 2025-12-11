# 🎓 EduPath AI - AI-Powered Personalized Learning Platform

<div align="center">

![EduPath AI](https://img.shields.io/badge/EduPath-AI%20Learning-blue?style=for-the-badge&logo=bookstack)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Groq AI](https://img.shields.io/badge/Groq-Llama%203.3-green?style=for-the-badge&logo=meta)

**An intelligent, fully AI-powered education platform that creates personalized learning experiences**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-quick-start) • [API Reference](#-api-endpoints)

</div>

---

## ✨ Features

### 🤖 100% AI-Powered Features

| Feature | AI Technology | Description |
|---------|--------------|-------------|
| **Personalized Roadmaps** | Groq Llama 3.3 70B | Generates custom learning paths based on career goals, experience level, and learning preferences |
| **Practice Challenges** | Groq Llama 3.3 70B | Creates coding challenges dynamically based on selected topics and difficulty |
| **Code Evaluation** | Groq Llama 3.3 70B | Reviews submitted code and provides detailed feedback, scores, and improvement suggestions |
| **Study Notes Generation** | Groq Llama 3.3 70B | Generates comprehensive study notes for any programming topic on demand |
| **Resource Curation** | Groq Llama 3.3 70B | Recommends the best free learning resources for any topic |
| **Quiz Generation** | Groq Llama 3.3 70B | Creates topic-specific quizzes with multiple choice questions |

### 🎯 Core Platform Features

- **🛤️ AI Learning Roadmaps** - Personalized paths with milestones, topics, and estimated completion times
- **💻 Monaco Code Editor** - VS Code's editor engine with IntelliSense, syntax highlighting, and multi-language support
- **📚 Study Resources** - AI-generated notes and curated learning materials
- **🏆 Real-time Leaderboard** - Competitive rankings based on XP and completed challenges
- **🎥 Video Tutorials** - YouTube integration for curated video content
- **📊 Progress Tracking** - Track completion, streaks, and learning statistics
- **🌙 Dark/Light Mode** - Beautiful UI with theme support
- **🔐 Authentication** - Secure user auth via Supabase

---

## 🏗️ Project Architecture

```
E-Learning Platform/
├── frontend/                 # Next.js 14 Frontend
│   ├── src/
│   │   ├── app/              # App Router Pages
│   │   │   ├── dashboard/    # User dashboard
│   │   │   ├── roadmaps/     # AI-generated roadmaps
│   │   │   ├── practice/     # Coding challenges + Monaco Editor
│   │   │   ├── resources/    # AI study notes
│   │   │   ├── leaderboard/  # Real-time rankings
│   │   │   ├── videos/       # YouTube tutorials
│   │   │   ├── learn/        # Topic learning pages
│   │   │   ├── onboarding/   # User onboarding flow
│   │   │   └── settings/     # User settings
│   │   ├── components/       # Reusable React components
│   │   ├── context/          # Auth & Theme contexts
│   │   └── lib/              # Utilities, Supabase client, Zustand store
│   └── package.json
│
├── backend/                  # Express.js API Server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── roadmap.ts    # AI roadmap generation
│   │   │   ├── practice.ts   # AI challenges & code evaluation
│   │   │   ├── resources.ts  # AI notes & resource curation
│   │   │   ├── notes.ts      # AI study notes
│   │   │   ├── videos.ts     # YouTube API integration
│   │   │   ├── users.ts      # User profiles & stats
│   │   │   └── progress.ts   # Learning progress tracking
│   │   ├── config/
│   │   │   ├── groq.ts       # Groq AI configuration
│   │   │   └── supabase.ts   # Supabase admin client
│   │   └── index.ts          # Express server entry
│   └── package.json
│
└── supabase/                 # Database Schema
    ├── schema.sql            # Core tables
    └── schema_complete.sql   # Full schema with RLS
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |
| **Monaco Editor** | VS Code's code editor |
| **Zustand** | State management |
| **React Hot Toast** | Notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| **Express.js** | REST API server |
| **TypeScript** | Type-safe backend |
| **Groq SDK** | AI model integration |
| **Llama 3.3 70B** | AI language model |
| **Supabase** | Database & Auth |

### AI Integration
| Model | Provider | Use Cases |
|-------|----------|-----------|
| **Llama 3.3 70B Versatile** | Groq | Roadmaps, Challenges, Code Review, Notes, Quizzes |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Groq API key
- YouTube Data API key (optional)

### 1. Clone the Repository
```bash
git clone https://github.com/BALAJIBHARGAV6/Edu-Path.git
cd Edu-Path
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env` file:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
YOUTUBE_API_KEY=your_youtube_api_key
```

Start the backend:
```bash
npm run dev
```
✅ Backend runs on http://localhost:5000

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `frontend/.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```
✅ Frontend runs on http://localhost:3000

### 4. Database Setup
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Run the SQL from `supabase/schema_complete.sql`

---

## 📡 API Endpoints

### Roadmap Routes
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/roadmap/generate` | POST | Generate personalized AI roadmap |
| `/api/roadmap/:userId` | GET | Get user's roadmap |

### Practice Routes
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/practice/challenges` | GET | Get AI-generated challenges |
| `/api/practice/submit-solution` | POST | Submit code for AI evaluation |
| `/api/practice/leaderboard` | GET | Get real-time leaderboard |
| `/api/practice/generate-test` | POST | Generate AI quiz |

### Resource Routes
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/resources/generate-notes` | POST | Generate AI study notes |
| `/api/resources/curated/:topic` | GET | Get AI-curated resources |
| `/api/notes/generate` | POST | Generate topic notes |

### User Routes
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/users/profile` | POST | Create/update profile |
| `/api/users/profile/:userId` | GET | Get user profile |
| `/api/users/stats/:userId` | GET | Get user statistics |

### Video Routes
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/videos/search` | GET | Search YouTube tutorials |

---

## 🎨 Key Pages

| Page | Route | Features |
|------|-------|----------|
| **Home** | `/` | Landing page with platform overview |
| **Dashboard** | `/dashboard` | User progress, streaks, milestones |
| **Roadmaps** | `/roadmaps` | View and manage AI learning paths |
| **Practice** | `/practice` | Monaco editor, AI challenges, code evaluation |
| **Resources** | `/resources` | AI-generated study notes |
| **Leaderboard** | `/leaderboard` | Weekly/monthly/all-time rankings |
| **Videos** | `/videos` | YouTube tutorial search |
| **Learn** | `/learn/[topicId]` | Topic-specific learning with videos & notes |

---

## 🔒 Security

- **Row Level Security (RLS)** - Database policies ensure users can only access their own data
- **Supabase Auth** - Secure authentication with email/password
- **Environment Variables** - Sensitive keys stored securely
- **Server-side API** - All AI calls made from backend to protect API keys

---

## ⚡ Performance Optimizations

- **Challenge Caching** - 5-minute server-side cache for AI-generated challenges
- **Client-side Caching** - Zustand store caches user data and roadmaps
- **Dynamic Imports** - Monaco Editor loaded only when needed
- **Fallback Data** - Graceful degradation if AI calls fail

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Balaji Bhargav**
- GitHub: [@BALAJIBHARGAV6](https://github.com/BALAJIBHARGAV6)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Built with ❤️ using AI

</div>
