# EduPath AI - Complete Documentation

## 🎨 Design System

### Color Theme: Neon Green & Black

The platform uses a **Neon Green & Black** color scheme with full dark/light theme support.

#### Dark Theme (Default)
- **Background**: Pure black (#000000) to near-black (#0A0A0A, #141414)
- **Primary Color**: Neon Green (#00F771)
- **Accent**: Cyan (#00FFE0)
- **Text**: White (#FFFFFF) with gray variants
- **Glow Effects**: Neon green shadows for emphasis

#### Light Theme
- **Background**: White (#FFFFFF) to light green tints (#F5FFF9)
- **Primary Color**: Green (#00D662, #00B854)
- **Text**: Black (#000000) with gray variants

### CSS Variables (globals.css)
```css
--neon-500: #00F771;      /* Main neon green */
--accent-cyan: #00FFE0;   /* Accent color */
--bg-primary: #000000;    /* Dark mode background */
--text-primary: #FFFFFF;  /* Dark mode text */
--glow: 0 0 20px rgba(0, 247, 113, 0.4);  /* Neon glow effect */
```

---

## 📁 Project Structure

```
E-Learning Platform/
├── frontend/                    # Next.js 14 Frontend
│   ├── src/
│   │   ├── app/                # App Router Pages
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── roadmaps/       # Roadmaps listing
│   │   │   ├── resources/      # AI Notes generator
│   │   │   ├── videos/         # Video tutorials search
│   │   │   ├── about/          # About page
│   │   │   ├── dashboard/      # User dashboard
│   │   │   ├── settings/       # User settings
│   │   │   ├── onboarding/     # Roadmap generation
│   │   │   ├── learn/[topicId] # Topic learning page
│   │   │   └── auth/           # Login/Signup
│   │   ├── components/
│   │   │   └── Navbar.tsx      # Navigation bar
│   │   ├── context/
│   │   │   ├── AuthContext.tsx # Supabase auth
│   │   │   └── ThemeContext.tsx# Dark/Light theme
│   │   └── lib/
│   │       ├── store.ts        # Zustand state
│   │       └── supabase.ts     # Supabase client
│   └── .env.local              # Environment variables
│
├── backend/                     # Express.js Backend
│   └── src/
│       ├── index.ts            # Server entry
│       └── routes/
│           ├── roadmap.ts      # AI roadmap generation
│           ├── videos.ts       # YouTube search
│           └── notes.ts        # AI notes generation
│
└── supabase/
    └── schema.sql              # Database schema
```

---

## 🚀 Pages & Features

### 1. Homepage (`/`)
- Hero section with neon gradient effects
- Feature cards (AI Roadmaps, Skill Analysis, Resources, Practice)
- "How It Works" steps
- CTA section
- Footer

### 2. Roadmaps (`/roadmaps`)
- List of predefined roadmaps (Frontend, Backend, Full Stack, DevOps, ML)
- Search functionality
- **"Generate Custom Roadmap"** CTA → redirects to onboarding
- Each roadmap card shows: learners count, duration, rating

### 3. Resources (`/resources`)
- **AI Notes Generator**: Enter any topic → generates study notes via Groq API
- Shows topics from user's roadmap (if logged in)
- Real-time note generation

### 4. Videos (`/videos`)
- Search for YouTube tutorials
- Quick search buttons from roadmap topics
- Links to YouTube search results

### 5. About (`/about`)
- Company story
- Stats (learners, countries, paths, rating)
- Values section
- CTA to sign up

### 6. Dashboard (`/dashboard`)
- **Real AI data only** - no dummy data
- Stats: Milestones, Completed topics, Est. time, Progress %
- Progress bar
- Expandable milestone list with topics
- Trending skills (from AI analysis)
- Skill gaps (from AI analysis)
- Quick actions: Regenerate roadmap

### 7. Settings (`/settings`)
- Profile tab: Name, avatar, sign out, delete account
- Appearance tab: Dark/Light theme toggle

### 8. Onboarding (`/onboarding`)
- Multi-step form to collect user data
- Generates AI roadmap via Groq API
- Saves to Zustand store

### 9. Learn Page (`/learn/[topicId]`)
- Topic overview
- YouTube video resources
- AI-generated study notes
- Mark as complete

---

## 🔧 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS** (custom neon theme)
- **Framer Motion** (animations)
- **Zustand** (state management)
- **Supabase** (authentication)

### Backend
- **Express.js**
- **TypeScript**
- **Groq API** (AI - Llama 3.3 70B)
- **YouTube Data API** (video search)

### Database
- **Supabase** (PostgreSQL)
- Tables: user_profiles, roadmaps, milestones, topics, user_progress, user_notes

---

## 🔑 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (.env)
```env
PORT=5000
GROQ_API_KEY=your_groq_api_key
YOUTUBE_API_KEY=your_youtube_api_key
```

---

## 🚀 Running the Project

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000



```

---

## 📱 Navigation Structure

### Navbar (Left side)
1. **EduPath** (Logo/Home)
2. **Roadmaps** - Browse learning paths
3. **Resources** - AI notes generator
4. **Videos** - Tutorial search
5. **About** - Company info

### Navbar (Right side)
1. **Theme Toggle** (Sun/Moon icon)
2. **User Menu** (when logged in)
   - Dashboard
   - Settings
   - Sign Out

---

## 🎯 User Flow

1. **Landing** → User visits homepage
2. **Explore** → Browse roadmaps or click "Get Started"
3. **Sign Up** → Create account with Supabase
4. **Onboarding** → Fill in goals, skills, experience
5. **AI Generation** → Groq API creates personalized roadmap
6. **Dashboard** → View progress, milestones, topics
7. **Learn** → Click topic → Watch videos, read AI notes
8. **Progress** → Mark topics complete, track progress

---

## 🔄 API Endpoints

### Backend Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/roadmap/generate` | Generate AI roadmap |
| GET | `/api/roadmap/:userId` | Get user's roadmap |
| POST | `/api/notes/generate` | Generate AI study notes |
| GET | `/api/videos/search` | Search YouTube videos |

---

## 📊 Data Flow

1. **Onboarding Data** → Sent to `/api/roadmap/generate`
2. **Groq API** → Generates structured roadmap JSON
3. **Frontend** → Stores in Zustand, displays in dashboard
4. **Topic Click** → Fetches videos & generates notes
5. **Progress** → Updated in Zustand store

---

## 🎨 Component Classes

### Buttons
- `.btn-primary` - Neon green, black text, glow effect
- `.btn-secondary` - Transparent, neon border
- `.btn-ghost` - Text only, hover highlight

### Cards
- `.card` - Dark elevated background, border, hover glow
- `.glass-card` - Glassmorphism with blur
- `.neon-border` - Neon green border with glow

### Text
- `.gradient-text` - Neon to cyan gradient
- `.neon-text` - Neon green with glow shadow

### Progress
- `.progress-bar` - Container
- `.progress-fill` - Animated gradient fill

### Roadmap
- `.roadmap-node.completed` - Green filled
- `.roadmap-node.current` - Gradient with pulse
- `.roadmap-node.locked` - Gray dashed border

---

## ✅ Features Implemented

- [x] Neon Green & Black theme
- [x] Dark/Light mode toggle
- [x] Glassmorphism navbar
- [x] AI roadmap generation (Groq)
- [x] AI notes generation
- [x] YouTube video search
- [x] User authentication (Supabase)
- [x] Dashboard with real AI data
- [x] Progress tracking
- [x] Responsive design
- [x] Framer Motion animations

---

## 📝 Notes

- All dashboard data comes from AI-generated roadmap
- No dummy/placeholder data in production views
- Theme persists in localStorage
- Roadmap stored in Zustand with persistence
