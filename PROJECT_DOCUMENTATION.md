# 🎓 EduPath AI - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Features & Pages](#features--pages)
5. [Problem Statement & Solution](#problem-statement--solution)
6. [Unique Value Proposition](#unique-value-proposition)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Setup & Deployment](#setup--deployment)
10. [Future Enhancements](#future-enhancements)

---

## 🌟 Project Overview

**EduPath AI** is a revolutionary, fully AI-powered personalized learning platform that adapts to each user's career goals, experience level, and learning preferences. Unlike traditional e-learning platforms that offer static content, EduPath AI dynamically generates custom learning paths, practice challenges, and real-time code evaluations using advanced AI models.

### 🎯 Mission
To democratize quality tech education by providing personalized, adaptive learning experiences that help anyone master programming and advance their career, regardless of their background or location.

### 📊 Project Stats
- **Total Pages:** 12+ Interactive Pages
- **AI Features:** 6 Core AI-Powered Features
- **Tech Stack:** 10+ Modern Technologies
- **Lines of Code:** 15,000+ (Frontend + Backend)
- **API Endpoints:** 25+ RESTful Endpoints

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.0.4 | React framework with App Router, Server Components, and optimized performance |
| **TypeScript** | 5.3.3 | Type-safe development with enhanced IDE support and compile-time error checking |
| **Tailwind CSS** | 3.4.0 | Utility-first CSS framework for rapid UI development |
| **Framer Motion** | 10.17.0 | Smooth animations and page transitions |
| **Monaco Editor** | 4.6.0 | VS Code's editor engine for professional code editing experience |
| **Zustand** | 4.4.7 | Lightweight state management with minimal boilerplate |
| **React Hot Toast** | 2.4.1 | Beautiful toast notifications |
| **Lucide React** | 0.303.0 | Modern icon library with 1000+ icons |
| **Three.js** | 0.160.1 | 3D graphics for interactive hero animations |
| **React Flow** | 11.11.4 | Interactive roadmap visualizations |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | JavaScript runtime for backend server |
| **Express.js** | 4.18.2 | Fast, minimalist web framework |
| **TypeScript** | 5.3.3 | Type-safe backend development |
| **Groq SDK** | 0.3.3 | Integration with Groq's ultra-fast LLM inference |
| **Helmet** | 7.1.0 | Security middleware for Express |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing configuration |
| **Morgan** | 1.10.0 | HTTP request logging |
| **Zod** | 3.22.4 | Schema validation for type-safe APIs |

### Database & Authentication
| Technology | Purpose |
|------------|---------|
| **Supabase** | PostgreSQL database with built-in auth, real-time subscriptions |
| **PostgreSQL** | Relational database for structured data storage |
| **Row Level Security (RLS)** | Database-level security policies |

### AI & Machine Learning
| Service | Model | Purpose |
|---------|-------|---------|
| **Groq** | Llama 3.3 70B Versatile | Roadmap generation, challenge creation |
| **Groq** | Llama 3.3 70B Versatile | Code evaluation and feedback |
| **Groq** | Llama 3.3 70B Versatile | Study notes generation |
| **Groq** | Llama 3.3 70B Versatile | AI assistant for Q&A |

### Deployment & DevOps
| Platform | Purpose |
|----------|---------|
| **Vercel** | Frontend hosting with automatic deployments |
| **Render** | Backend API server hosting |
| **GitHub** | Version control and CI/CD integration |
| **Railway** | Alternative deployment platform (configured) |

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next.js 14 Frontend (Vercel)                 │   │
│  │  - App Router (RSC)    - Monaco Editor              │   │
│  │  - Zustand State       - Framer Motion              │   │
│  │  - React Components    - Tailwind CSS               │   │
│  └────────────┬─────────────────────────────────────────┘   │
└───────────────┼─────────────────────────────────────────────┘
                │ HTTPS/REST
┌───────────────┼─────────────────────────────────────────────┐
│               ▼          API LAYER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       Express.js Backend API (Render)                │   │
│  │  /api/roadmap     /api/practice                     │   │
│  │  /api/users       /api/resources                     │   │
│  │  /api/videos      /api/notes                        │   │
│  │  /api/progress    /api/leaderboard                  │   │
│  └────────┬──────────────────────────────┬──────────────┘   │
└───────────┼──────────────────────────────┼──────────────────┘
            │                              │
            │                              │ Groq API
            │                              ▼
┌───────────┼────────────────────────  ┌──────────────────┐
│           ▼         DATA LAYER       │  AI LAYER (Groq) │
│  ┌─────────────────────────────┐    │  Llama 3.3 70B   │
│  │  Supabase (PostgreSQL)      │    │  - Roadmaps      │
│  │  - user_profiles            │    │  - Challenges    │
│  │  - roadmaps                 │    │  - Evaluation    │
│  │  - roadmap_progress         │    │  - Notes Gen     │
│  │  - user_notes               │    │  - Q&A Chat      │
│  │  - practice_submissions     │    └──────────────────┘
│  │  - leaderboard              │
│  └─────────────────────────────┘
└──────────────────────────────────────
```

### Data Flow

#### 1. User Onboarding Flow
```
User Signs Up → Onboarding Page → Collects:
  ├─ Full Name
  ├─ Career Goal (Frontend/Backend/Full Stack/Mobile/DevOps/Data Science)
  ├─ Experience Level (Beginner/Intermediate/Advanced)
  ├─ Previous Skills (HTML, CSS, JS, React, Python, etc.)
  ├─ Learning Style (Visual/Reading/Hands-on/Mixed)
  └─ Weekly Hours Available
     ↓
Backend /api/roadmap/generate
  ├─ Sends user preferences to Groq AI
  ├─ AI generates personalized roadmap (10+ concepts per level)
  ├─ Saves to Supabase (roadmaps table)
  └─ Returns structured roadmap with milestones
     ↓
User redirected to Dashboard with personalized roadmap
```

#### 2. Practice Challenge Flow
```
User Opens Practice Page
  ↓
Fetches user profile → Gets career_goal
  ↓
Backend /api/practice/challenges?category={career-topic}&difficulty={level}
  ├─ AI generates 6 coding challenges
  ├─ Tailored to user's career path (Frontend: React, Backend: Node.js, etc.)
  └─ Returns challenges with examples and test cases
     ↓
User Writes Code in Monaco Editor
  ↓
Backend /api/practice/submit-solution
  ├─ Sends code + challenge to Groq AI
  ├─ AI evaluates code quality, correctness, efficiency
  ├─ Runs tests, provides feedback, suggests improvements
  ├─ Saves submission to Supabase
  └─ Awards XP points (50 per challenge)
     ↓
Updates leaderboard and user progress
```

#### 3. Video Learning Flow
```
User Opens Videos Page
  ↓
Fetches user profile → Gets career_goal
  ↓
Frontend filters video library by career:
  ├─ Frontend Dev: HTML, CSS, JS, React, TypeScript
  ├─ Backend Dev: Node.js, Python, Java, SQL
  ├─ Full Stack: All of the above
  ├─ Mobile Dev: React Native, Flutter, Swift
  ├─ DevOps: Docker, Kubernetes, CI/CD, AWS
  └─ Data Science: Python, ML, Pandas, Statistics
     ↓
Shows curated YouTube tutorials from top creators
  ├─ freeCodeCamp, Traversy Media, Net Ninja
  ├─ Programming with Mosh, Web Dev Simplified
  └─ Sorted by relevance and quality
```

---

## 📄 Features & Pages

### 1. 🏠 **Home Page** (`/`)
**Purpose:** Landing page that showcases the platform's value proposition

**Key Features:**
- Animated hero section with Three.js 3D background
- Interactive statistics counter (CountUp animation)
- Feature showcase with icon animations
- Call-to-action buttons (Get Started, Learn More)
- Responsive design with dark/light mode support

**Unique Elements:**
- Dual marquee scrolling testimonials
- Gradient text effects with animated shine
- Smooth scroll animations (Framer Motion)
- Interactive "How It Works" section

---

### 2. 🎯 **Onboarding Page** (`/onboarding`)
**Purpose:** Personalized user onboarding to collect preferences

**5-Step Process:**

**Step 1: Basic Info**
- Full Name input
- Career Goal selection (6 options)
  - Frontend Developer
  - Backend Developer
  - Full Stack Developer
  - Mobile Developer
  - DevOps Engineer
  - Data Scientist

**Step 2: Experience Level**
- Beginner (Just starting out)
- Intermediate (1-2 years experience)
- Advanced (3+ years experience)

**Step 3: Previous Skills** ⭐ NEW
- 25+ common tech skills displayed as buttons
- Multi-select interface
- Skills include: HTML, CSS, JavaScript, TypeScript, React, Angular, Vue.js, Node.js, Python, Java, C++, SQL, MongoDB, Git, Docker, AWS, etc.
- Visual feedback with selected skills highlighted
- Optional step - users can skip if no previous skills

**Step 4: Learning Style**
- Visual (Video-based learning)
- Reading (Documentation and articles)
- Hands-on (Coding challenges)
- Mixed (Combination of all)

**Step 5: Weekly Commitment**
- Slider to select hours per week (1-40 hours)
- Visual feedback with large number display
- Helps AI estimate learning path duration

**AI Integration:**
- Sends all data to `/api/roadmap/generate`
- Groq AI creates personalized roadmap based on:
  - Career goal → Determines core technologies
  - Experience level → Adjusts difficulty
  - Previous skills → Skips basics if already known
  - Learning style → Recommends content types
  - Weekly hours → Estimates completion timeline

**UI/UX:**
- Progress bar (20% per step)
- Smooth slide transitions
- Back/Next navigation
- Form validation on each step
- Loading state with spinner during AI generation

---

### 3. 📊 **Dashboard Page** (`/dashboard`)
**Purpose:** Centralized hub showing user's progress and quick actions

**Layout Sections:**

**Stats Grid (Top):**
- 🔥 Streak Counter
  - Days of continuous learning
  - Updates daily on activity
  
- ⚡ Total XP
  - 50 XP per completed concept
  - 100 XP per completed challenge
  - AnimatedNumber for smooth counting
  
- 📚 Concepts Learned
  - Count of completed concepts from roadmap
  
- 📊 Overall Progress
  - Percentage of roadmap completion
  - Visual progress ring

**Quick Actions Cards:**
- 🛤️ View Roadmap
- 💻 Practice Coding
- 🎥 Watch Videos
- 🤖 AI Chat Assistant

**Active Roadmap Section:**
- Current level display (Beginner/Intermediate/Advanced)
- Next 3 upcoming concepts
- Completion checkboxes
- Sequential unlocking (must complete previous to unlock next)
- Visual indicator for locked/unlocked/completed states

**Achievement Badges:**
- 🎯 First Steps (Complete first concept)
- 🔥 On Fire (7-day streak)
- 💪 Dedicated (Complete 10 concepts)
- Custom badge graphics with gradient backgrounds

**Daily Tips:**
- Rotating coding tips
- Motivational messages
- Study technique suggestions

**Real-time Updates:**
- Auto-saves progress to Supabase
- Updates XP on concept completion
- Recalculates overall progress percentage
- Syncs across devices

---

### 4. 🛤️ **Roadmaps Page** (`/roadmaps`)
**Purpose:** Interactive visualization of personalized learning path

**Key Features:**

**Level System:**
- 3 Levels: Beginner → Intermediate → Advanced
- 10 concepts per level (30 total)
- Auto-progression: Completing all 10 beginner concepts auto-generates intermediate level

**Level-Specific Content:**
```javascript
Beginner (Frontend Dev):
- HTML Basics, CSS Fundamentals, JavaScript Basics
- DOM Manipulation, Flexbox Layout, CSS Grid
- Responsive Design, Git Basics, VS Code Setup
- Browser DevTools

Intermediate (Frontend Dev):
- React Fundamentals, Component Lifecycle, Hooks
- State Management (Context/Redux), React Router
- API Integration, Form Validation, Error Handling
- Performance Optimization

Advanced (Frontend Dev):
- Advanced React Patterns, Server-Side Rendering
- Next.js Framework, TypeScript Integration
- Testing (Jest, React Testing Library)
- CI/CD Pipeline, Production Deployment
```

**AI Generation:**
- Backend endpoint: `/api/roadmap/generate-next-level`
- Analyzes current level completion
- Generates contextually relevant next level
- Considers user's career goal and learning pace

**Interactive Elements:**
- Click concept to expand details
- Checkboxes to mark completion
- Progress bar per level
- Visual level stepper (3 circles)
- Animated transitions between levels

**Progress Tracking:**
- Saves to `roadmap_progress` table in Supabase
- Tracks concept completion per user
- Calculates XP rewards
- Updates dashboard statistics

---

### 5. 💻 **Practice Page** (`/practice`)
**Purpose:** Hands-on coding challenges with AI evaluation

**Dynamic Content by Career:** ⭐ NEW
```javascript
Frontend Developer → JavaScript, React, TypeScript, CSS challenges
Backend Developer → Node.js, Python, Java, SQL challenges
Full Stack Developer → Mix of frontend + backend
Mobile Developer → React Native, Flutter, Dart
DevOps Engineer → Python, Bash scripting, Docker
Data Scientist → Python, Algorithms, Data Structures
```

**Features:**

**Challenge Browser:**
- 6 AI-generated challenges per topic
- Difficulty filter (Easy/Medium/Hard)
- Topic selection based on career goal
- Acceptance rate display
- Completion status tracking

**Code Editor (Monaco):**
- VS Code editor engine
- Syntax highlighting for 5+ languages:
  - JavaScript, TypeScript, Python, Java, C++
- IntelliSense (auto-completion)
- Multi-cursor editing
- Minimap toggle
- Dark/Light theme sync
- Line numbers and folding
- Tab size: 2 spaces

**Challenge Structure:**
- Title + Difficulty badge
- Problem description
- Example test cases
- Input/Output format
- Constraints
- Category tag

**Submission & Evaluation:**
- "Run Code" button
- Backend: `/api/practice/submit-solution`
- Groq AI evaluates:
  - ✅ Correctness (passes test cases)
  - ⚡ Efficiency (time/space complexity)
  - 📝 Code quality (readability, best practices)
  - 🎯 Score out of 100
  
**Detailed Feedback:**
```
✅ PASSED - Score: 85/100

📝 Feedback:
Your solution is correct and handles all test cases.

🧪 Tests: 4/4 passed

✅ Strengths:
  • Clean variable naming
  • Efficient algorithm choice
  • Good edge case handling

⚠️ Improvements:
  • Consider adding inline comments
  • Could optimize with hash map for O(n) time

⚡ Complexity: O(n²) time, O(1) space
```

**Gamification:**
- XP rewards (100 per challenge)
- Completion badges
- Leaderboard ranking
- Streak tracking

---

### 6. 📚 **Resources Page** (`/resources`)
**Purpose:** Study materials and AI-powered Q&A assistant

**Tabbed Interface:**

**Tab 1: Study Notes**
- Topic search bar (300+ programming topics)
- Examples: "React Hooks", "Python Lists", "SQL Joins"
- AI generates comprehensive notes:
  - Concept explanation
  - Code examples with syntax highlighting
  - Common use cases
  - Best practices
  - Related topics
- Save/Copy functionality
- Dark/light theme optimized

**Tab 2: AI Chat Assistant** ⭐ NEW
- ChatGPT-style conversational interface
- Powered by Groq Llama 3.3 70B
- Features:
  - Real-time typing indicators
  - Message history
  - Copy individual messages
  - Clear chat button
  - Markdown rendering
  - Code syntax highlighting in responses
  
**System Prompt:**
```
You are an expert programming tutor helping students learn to code.
Provide clear, concise answers with examples.
Break down complex concepts into simple terms.
Encourage best practices and industry standards.
```

**Use Cases:**
- "Explain async/await in JavaScript"
- "How do I center a div in CSS?"
- "What's the difference between let, const, and var?"
- "Debug my React component"
- "Best practices for REST API design"

**Chat Features:**
- Scroll stays at top (doesn't auto-scroll to bottom)
- Message timestamps
- Error handling with retry
- Loading states
- Persistent chat history (session-based)

---

### 7. 🎥 **Videos Page** (`/videos`)
**Purpose:** Curated video tutorials from top creators

**Dynamic Content by Career:** ⭐ NEW
```javascript
getCareerTopics(career_goal) {
  'Frontend Developer' → HTML, CSS, JavaScript, React, TypeScript, Git
  'Backend Developer' → Node.js, Python, Java, SQL, APIs, Git
  'Full Stack Developer' → All frontend + backend topics
  'Mobile Developer' → React Native, Flutter, Swift, Kotlin
  'DevOps Engineer' → Docker, Kubernetes, CI/CD, AWS, Linux
  'Data Scientist' → Python, ML, Pandas, NumPy, SQL, Statistics
}
```

**Video Library:**
- 50+ handpicked YouTube tutorials
- Organized by topic categories
- Real video data (IDs, thumbnails, durations)

**Top Channels Featured:**
- freeCodeCamp
- Traversy Media
- Programming with Mosh
- Web Dev Simplified
- Net Ninja
- Kevin Powell
- Bro Code

**Features:**
- Search bar (title/channel search)
- Topic filter buttons (dynamic based on career)
- Personalized banner: "Frontend Developer path - Showing videos for: HTML, CSS, JavaScript..."
- Video cards with:
  - HD thumbnail
  - Duration badge
  - View count
  - Channel name
  - "Watch" button → Opens YouTube
  - "Mark as Watched" toggle
  
**Progress Tracking:**
- Saves watched videos to Supabase
- Updates dashboard statistics
- Shows watched count per topic

**Responsive Design:**
- Grid layout (1/2/3 columns based on screen size)
- Hover effects
- Lazy loading for performance

---

### 8. 🏆 **Leaderboard Page** (`/leaderboard`)
**Purpose:** Competitive ranking system to motivate learners

**Ranking Metrics:**
- Total XP (primary sorting)
- Completed challenges
- Concepts learned
- Streak days
- Rank position (#1, #2, #3...)

**Display:**
- Top 3 podium with special styling
  - 🥇 Gold for #1
  - 🥈 Silver for #2
  - 🥉 Bronze for #3
- Remaining users in list format
- User's own rank highlighted
- Profile pictures/avatars
- Real-time updates

**Stats Shown:**
- Username/Display name
- Total XP
- Completed challenges count
- Current streak
- Badge icons for achievements

**Filters:**
- All Time
- This Month
- This Week
- By Career Path

**Gamification:**
- Encourages daily learning
- Social proof ("10 users completed challenges today")
- Achievement badges visible
- Rank change indicators (↑↓)

---

### 9. ⚙️ **Settings Page** (`/settings`)
**Purpose:** User profile management and preferences

**Sections:**

**Profile Settings:**
- Full Name
- Email (read-only from auth)
- Avatar upload
- Career Goal (editable)
- Experience Level update
- Bio/Description

**Learning Preferences:**
- Weekly hours commitment
- Learning style
- Preferred content types (videos/articles/challenges)
- Notification preferences
- Email digest frequency

**Account Settings:**
- Change password
- Two-factor authentication
- Connected accounts (GitHub, LinkedIn)
- Delete account (with confirmation)

**Privacy:**
- Profile visibility (public/private)
- Show progress on leaderboard
- Share achievements

**Theme:**
- Dark/Light mode toggle
- System preference option
- Custom accent color picker

**Data Management:**
- Export learning data (JSON)
- Reset progress (with confirmation)
- Download certificates

---

### 10. 🔐 **Auth Pages** (`/auth/login`, `/auth/signup`)

**Login Page:**
- Email + Password authentication
- "Remember Me" checkbox
- "Forgot Password?" link
- Social login (GitHub, Google)
- Supabase auth integration
- Error handling (invalid credentials)

**Signup Page:**
- Email + Password registration
- Password strength indicator
- Terms & Conditions checkbox
- Email verification flow
- Auto-redirect to onboarding after signup

**Security:**
- Passwords hashed with bcrypt
- JWT tokens for session management
- HTTPS only
- CSRF protection

---

### 11. ℹ️ **About Page** (`/about`)
**Purpose:** Platform information and mission

**Content:**
- Platform story and vision
- Team introduction (if applicable)
- Technology stack showcase
- Statistics (users, courses, concepts)
- Contact information
- FAQ section
- Press kit/Media resources

---

### 12. 🧪 **Test Page** (`/test`)
**Purpose:** Connection testing and diagnostics

**Tests:**
- Frontend → Backend API connectivity
- Backend → Supabase database connection
- Backend → Groq AI API status
- WebSocket real-time connection
- Network latency measurements
- Service health status (green/red indicators)

**Use Case:**
- Debugging deployment issues
- Monitoring service status
- Developer diagnostics

---

## 🎯 Problem Statement & Solution

### 📉 Problems with Traditional Learning Platforms

#### 1. **One-Size-Fits-All Approach**
**Problem:** Coursera, Udemy, and similar platforms offer the same content to everyone, regardless of their background, goals, or learning pace.

**Real Impact:**
- Beginners waste time on advanced content
- Experienced developers bored with basics
- No adaptation to individual career goals
- High dropout rates (60-70% course abandonment)

**EduPath Solution:**
- ✅ AI generates personalized roadmaps based on career goal, experience, and skills
- ✅ Dynamic difficulty adjustment per user
- ✅ Skips concepts user already knows (based on previous skills)
- ✅ Adapts to learning pace (slow/moderate/fast)

---

#### 2. **Static, Outdated Content**
**Problem:** Courses are created once and rarely updated, leading to outdated information in fast-changing tech fields.

**Real Impact:**
- Learning deprecated technologies
- Missing latest best practices
- No real-world application
- Content created 3-5 years ago

**EduPath Solution:**
- ✅ AI generates fresh content on-demand
- ✅ Always uses latest technologies and patterns
- ✅ Incorporates current industry standards
- ✅ No outdated videos or articles

---

#### 3. **No Real-Time Feedback**
**Problem:** Platforms offer quizzes with multiple-choice answers but no code review or personalized feedback.

**Real Impact:**
- Students don't know *why* their code is wrong
- No guidance on code quality or best practices
- Can't improve problem-solving skills
- Binary pass/fail with no nuance

**EduPath Solution:**
- ✅ AI evaluates code line-by-line
- ✅ Provides detailed feedback on correctness, efficiency, and quality
- ✅ Suggests specific improvements with examples
- ✅ Explains time/space complexity
- ✅ Score out of 100 with breakdown

---

#### 4. **Disconnected Learning Resources**
**Problem:** Videos on one platform, coding practice on another, notes in a third place. No unified learning experience.

**Real Impact:**
- Context switching reduces productivity
- Hard to track overall progress
- No correlation between theory and practice
- Fragmented learning journey

**EduPath Solution:**
- ✅ All-in-one platform: videos, challenges, notes, AI chat
- ✅ Unified progress tracking across all activities
- ✅ Roadmap integrates all learning modes
- ✅ Single source of truth for your learning path

---

#### 5. **Lack of Motivation & Accountability**
**Problem:** Self-paced courses have no social elements, gamification, or accountability mechanisms.

**Real Impact:**
- Easy to quit when unmotivated
- No peer comparison or competition
- No celebration of milestones
- Isolation in learning journey

**EduPath Solution:**
- ✅ XP system with points for every action
- ✅ Leaderboard for competitive motivation
- ✅ Streak tracking for consistency
- ✅ Achievement badges for milestones
- ✅ Daily tips and encouragement
- ✅ Real-time progress dashboard

---

#### 6. **Expensive Subscription Models**
**Problem:** Quality platforms charge $50-100/month, making education inaccessible to many.

**Real Impact:**
- Financial barrier to entry
- Can't afford multiple subscriptions
- No way to try before committing
- Limited access in developing countries

**EduPath Solution:**
- ✅ FREE core features (roadmaps, practice, videos)
- ✅ No credit card required to start
- ✅ Open-source learning resources
- ✅ Accessible to anyone worldwide
- ✅ Optional premium features for advanced users

---

## 🌟 Unique Value Proposition

### What Makes EduPath AI Different?

#### 1. **100% AI-Powered Personalization**
- Every roadmap is uniquely generated for each user
- No two users see the exact same learning path
- AI considers: career goal, experience, skills, learning style, time commitment
- Competitor platforms: Static course catalogs with no personalization

#### 2. **Real-Time AI Code Evaluation**
- Not just "right" or "wrong" - detailed analysis of code quality
- Groq's ultra-fast inference (< 2 seconds for full evaluation)
- Feedback on correctness, efficiency, readability, best practices
- Competitor platforms: Only offer pre-defined test cases, no AI feedback

#### 3. **Dynamic Content Generation**
- Challenges, notes, and explanations generated on-demand
- Always current with latest technologies
- Adapts to user's specific needs and questions
- Competitor platforms: Pre-recorded videos and static content

#### 4. **Career-Specific Learning Paths**
- Frontend, Backend, Full Stack, Mobile, DevOps, Data Science
- Videos, challenges, and concepts tailored to career goal
- No irrelevant content wasting user's time
- Competitor platforms: Generic "Web Development" courses for everyone

#### 5. **Professional Development Tools**
- Monaco Editor (VS Code's engine) for realistic coding experience
- Industry-standard tools (Git, Docker mentioned in content)
- Real-world project-based learning
- Competitor platforms: Simple text boxes or basic code editors

#### 6. **Comprehensive Learning Hub**
- Videos, challenges, notes, AI chat, roadmaps - all in one place
- Unified progress tracking across all activities
- Single dashboard to see entire learning journey
- Competitor platforms: Siloed features across multiple apps

#### 7. **Level-Based Progression System**
- Beginner → Intermediate → Advanced
- Auto-unlocking of next level upon completion
- Sequential learning preventing knowledge gaps
- Visual progress indicators
- Competitor platforms: Linear course structure with no level branching

#### 8. **AI Chat Assistant Available 24/7**
- Instant answers to coding questions
- No waiting for instructor responses
- Unlimited queries
- Competitor platforms: Forums with 1-3 day response times

#### 9. **Gamification Done Right**
- XP points, streaks, achievements, leaderboard
- Motivates consistent learning
- Social proof and competition
- Competitor platforms: Minimal or no gamification

#### 10. **Open & Transparent**
- Open-source roadmap
- Clear documentation
- Community-driven improvements
- Competitor platforms: Closed-source, proprietary systems

---

## 🗄️ Database Schema

### Core Tables

#### 1. `user_profiles`
Extends Supabase Auth with additional profile data.

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  career_goal TEXT,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  learning_style TEXT CHECK (learning_style IN ('visual', 'reading', 'hands-on', 'mixed')),
  learning_pace TEXT CHECK (learning_pace IN ('slow', 'moderate', 'fast')),
  hours_per_week INTEGER DEFAULT 10,
  preferred_content TEXT[] DEFAULT ARRAY['videos', 'articles'],
  skills TEXT[] DEFAULT ARRAY[]::TEXT[], -- ⭐ NEW: Previous skills
  avatar_url TEXT,
  streak_count INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Fields:**
- `career_goal`: Used to filter videos and challenges
- `skills`: Array of previous skills (e.g., ['JavaScript', 'React', 'Node.js'])
- `experience_level`: Determines initial roadmap difficulty
- `streak_count`: Days of continuous learning
- `total_xp`: Used for leaderboard ranking

---

#### 2. `roadmaps`
Stores AI-generated personalized learning roadmaps.

```sql
CREATE TABLE roadmaps (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  career_path TEXT NOT NULL,
  current_level TEXT DEFAULT 'beginner',
  ai_generated_path JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sample `ai_generated_path` JSONB:**
```json
{
  "levels": [
    {
      "level": "beginner",
      "concepts": [
        { "id": 1, "title": "HTML Basics", "completed": true },
        { "id": 2, "title": "CSS Fundamentals", "completed": false }
      ]
    }
  ]
}
```

---

#### 3. `roadmap_progress`
Tracks concept completion and XP rewards.

```sql
CREATE TABLE roadmap_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  roadmap_id INTEGER REFERENCES roadmaps(id) ON DELETE CASCADE,
  concept_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  xp_earned INTEGER DEFAULT 50,
  notes TEXT,
  UNIQUE(user_id, roadmap_id, concept_id)
);
```

---

#### 4. `practice_submissions`
Stores code challenge submissions and AI evaluations.

```sql
CREATE TABLE practice_submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  challenge_title TEXT,
  code TEXT NOT NULL,
  language TEXT DEFAULT 'javascript',
  score INTEGER,
  passed BOOLEAN DEFAULT FALSE,
  ai_feedback JSONB,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Sample `ai_feedback` JSONB:**
```json
{
  "score": 85,
  "feedback": "Your solution is correct...",
  "testsPassed": 4,
  "testsTotal": 4,
  "strengths": ["Clean code", "Efficient algorithm"],
  "improvements": ["Add comments", "Consider edge cases"],
  "efficiency": "O(n) time, O(1) space"
}
```

---

#### 5. `user_notes`
User-created and AI-generated study notes.

```sql
CREATE TABLE user_notes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

#### 6. `leaderboard` (View)
Materialized view for leaderboard rankings.

```sql
CREATE MATERIALIZED VIEW leaderboard AS
SELECT 
  u.id,
  u.full_name,
  u.avatar_url,
  u.total_xp,
  u.streak_count,
  COUNT(DISTINCT rp.id) AS concepts_completed,
  COUNT(DISTINCT ps.id) AS challenges_completed,
  ROW_NUMBER() OVER (ORDER BY u.total_xp DESC) AS rank
FROM user_profiles u
LEFT JOIN roadmap_progress rp ON u.id = rp.user_id AND rp.completed = true
LEFT JOIN practice_submissions ps ON u.id = ps.user_id AND ps.passed = true
GROUP BY u.id
ORDER BY u.total_xp DESC;
```

---

### Row Level Security (RLS) Policies

```sql
-- Users can only read/update their own profile
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can only access their own roadmaps
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roadmaps" ON roadmaps
  FOR SELECT USING (auth.uid() = user_id);

-- Leaderboard is publicly readable
ALTER MATERIALIZED VIEW leaderboard OWNER TO authenticated;
GRANT SELECT ON leaderboard TO authenticated;
```

---

## 🔌 API Endpoints

### Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://edu-path.onrender.com/api`

---

### 🛤️ Roadmap Endpoints

#### `POST /roadmap/generate`
Generates personalized AI roadmap based on user preferences.

**Request Body:**
```json
{
  "user_id": "uuid",
  "fullName": "John Doe",
  "careerGoal": "Frontend Developer",
  "experienceLevel": "beginner",
  "skills": ["HTML", "CSS"],
  "learningStyle": "hands-on",
  "hoursPerWeek": 15
}
```

**Response:**
```json
{
  "success": true,
  "roadmap": {
    "id": 123,
    "title": "Frontend Developer Path",
    "ai_generated_path": {
      "levels": [
        {
          "level": "beginner",
          "concepts": [...]
        }
      ]
    }
  }
}
```

**AI Prompt Example:**
```
Generate a personalized Frontend Developer roadmap for a beginner 
with previous skills in HTML and CSS, learning style hands-on, 
15 hours per week commitment. Include 10 concepts for beginner level.
```

---

#### `POST /roadmap/generate-next-level`
Generates next level (intermediate/advanced) after completing current level.

**Request Body:**
```json
{
  "userId": "uuid",
  "roadmapId": 123,
  "currentLevel": "beginner",
  "completedConcepts": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}
```

---

#### `GET /roadmap/:userId`
Fetches user's active roadmap.

**Response:**
```json
{
  "success": true,
  "roadmap": { ...roadmap data... }
}
```

---

#### `PUT /roadmap/progress`
Updates concept completion status.

**Request Body:**
```json
{
  "userId": "uuid",
  "roadmapId": 123,
  "conceptId": 5,
  "completed": true
}
```

---

### 💻 Practice Endpoints

#### `GET /practice/challenges`
Fetches AI-generated coding challenges.

**Query Parameters:**
- `category` (string): JavaScript, React, Python, etc.
- `difficulty` (string): easy, medium, hard, mixed
- `count` (number): Number of challenges (default: 6)

**Response:**
```json
{
  "success": true,
  "challenges": [
    {
      "id": "1",
      "title": "Two Sum",
      "desc": "Find two numbers that add up to target",
      "difficulty": "easy",
      "category": "JavaScript",
      "acceptance": 48,
      "examples": [...]
    }
  ]
}
```

---

#### `POST /practice/submit-solution`
Submits code for AI evaluation.

**Request Body:**
```json
{
  "userId": "uuid",
  "challengeId": "1",
  "code": "function solution(nums, target) { ... }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "success": true,
  "evaluation": {
    "passed": true,
    "score": 85,
    "feedback": "Your solution is correct...",
    "testsPassed": 4,
    "testsTotal": 4,
    "strengths": ["Clean code", "Efficient"],
    "improvements": ["Add comments"],
    "efficiency": "O(n) time, O(1) space"
  }
}
```

**AI Evaluation Prompt:**
```
Evaluate this JavaScript code for the Two Sum problem:
[CODE]

Provide:
1. Correctness (passes test cases?)
2. Efficiency (time/space complexity)
3. Code quality (readability, best practices)
4. Score out of 100
5. Specific strengths and improvements
```

---

### 📚 Resources Endpoints

#### `POST /resources/generate-notes`
Generates AI study notes for a topic.

**Request Body:**
```json
{
  "topic": "React Hooks",
  "userId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "notes": {
    "topic": "React Hooks",
    "content": "# React Hooks\n\nReact Hooks are functions that let you...",
    "examples": [...],
    "bestPractices": [...]
  }
}
```

---

#### `POST /resources/chat`
AI chat assistant for Q&A.

**Request Body:**
```json
{
  "message": "Explain async/await in JavaScript",
  "context": ["previous", "messages"],
  "userId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "response": "async/await is a modern syntax for handling asynchronous operations..."
}
```

---

### 🎥 Videos Endpoints

#### `GET /videos/search`
Searches YouTube for tutorial videos (via Invidious API).

**Query Parameters:**
- `query` (string): Search term (e.g., "React tutorial")

**Response:**
```json
{
  "success": true,
  "videos": [
    {
      "videoId": "abc123",
      "title": "React Crash Course",
      "thumbnail": "https://...",
      "channelName": "Traversy Media",
      "duration": "1:30:45",
      "views": "2.3M"
    }
  ]
}
```

---

### 👤 User Endpoints

#### `GET /users/profile/:userId`
Fetches user profile data.

**Response:**
```json
{
  "success": true,
  "profile": {
    "full_name": "John Doe",
    "career_goal": "Frontend Developer",
    "experience_level": "beginner",
    "skills": ["HTML", "CSS", "JavaScript"],
    "total_xp": 1250,
    "streak_count": 7
  }
}
```

---

#### `PUT /users/profile/:userId`
Updates user profile.

**Request Body:**
```json
{
  "career_goal": "Full Stack Developer",
  "hours_per_week": 20
}
```

---

### 🏆 Leaderboard Endpoints

#### `GET /leaderboard`
Fetches leaderboard rankings.

**Query Parameters:**
- `limit` (number): Top N users (default: 100)
- `filter` (string): all, week, month

**Response:**
```json
{
  "success": true,
  "leaderboard": [
    {
      "rank": 1,
      "full_name": "Alice",
      "total_xp": 5000,
      "concepts_completed": 45,
      "challenges_completed": 30,
      "streak_count": 21
    }
  ]
}
```

---

### 📊 Progress Endpoints

#### `GET /progress/:userId`
Fetches user's overall progress statistics.

**Response:**
```json
{
  "success": true,
  "progress": {
    "total_xp": 1250,
    "concepts_completed": 15,
    "challenges_completed": 8,
    "videos_watched": 12,
    "notes_created": 5,
    "streak_count": 7,
    "completion_percentage": 45
  }
}
```

---

## 🚀 Setup & Deployment

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Git
- Supabase account
- Groq API key

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/BALAJIBHARGAV6/Edu-Path.git
cd Edu-Path
```

#### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

#### 3. Environment Variables

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Backend `.env`:**
```env
PORT=5000
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
NODE_ENV=development
```

#### 4. Database Setup

Run SQL schema in Supabase SQL Editor:
```bash
# Execute schema.sql in Supabase dashboard
cat supabase/schema.sql
```

#### 5. Run Development Servers

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

---

### Production Deployment

#### Frontend (Vercel)

1. **Connect GitHub Repository:**
   - Go to vercel.com
   - Import Edu-Path repository
   - Select `frontend` as root directory

2. **Environment Variables:**
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add `NEXT_PUBLIC_API_URL` (backend URL)

3. **Build Settings:**
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Deploy:**
   - Automatic deployments on main branch push
   - Preview deployments on PRs

**Live URL:** https://edu-path-learn.vercel.app

---

#### Backend (Render)

1. **Create Web Service:**
   - Go to render.com
   - Connect Edu-Path repository
   - Select `backend` as root directory

2. **Settings:**
   - Name: edu-path-backend
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Environment Variables:**
   - Add `GROQ_API_KEY`
   - Add `SUPABASE_URL`
   - Add `SUPABASE_SERVICE_KEY`
   - Add `NODE_ENV=production`

4. **Auto-Deploy:**
   - Enable auto-deploy from main branch

**Live URL:** https://edu-path.onrender.com

---

#### Database (Supabase)

1. **Create Project:**
   - Go to supabase.com
   - Create new project
   - Note down project URL and keys

2. **Run Migrations:**
   - Open SQL Editor
   - Execute `schema.sql`
   - Enable RLS policies

3. **Configure Auth:**
   - Enable email/password auth
   - Configure OAuth providers (optional)

---

### CI/CD Pipeline

**GitHub Actions (`.github/workflows/deploy.yml`):**
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: curl https://api.render.com/deploy/...
```

---

## 🔮 Future Enhancements

### Phase 1: Enhanced Features (Q1 2025)

1. **Real-time Collaboration**
   - Pair programming sessions
   - Live code sharing
   - Multiplayer challenges
   - Voice/Video chat integration

2. **Certificate System**
   - Completion certificates
   - Blockchain verification
   - LinkedIn integration
   - Shareable achievements

3. **Project Portfolio**
   - Build real-world projects
   - GitHub integration
   - Project showcases
   - Code reviews from AI

4. **Advanced Analytics**
   - Learning velocity tracking
   - Weak areas identification
   - Time spent per concept
   - Optimal learning times

---

### Phase 2: Community Features (Q2 2025)

5. **Discussion Forums**
   - Topic-specific threads
   - Ask questions
   - Share solutions
   - Upvote helpful answers

6. **Mentorship System**
   - Connect with experienced developers
   - Schedule 1-on-1 sessions
   - Career guidance
   - Code review requests

7. **Study Groups**
   - Create private groups
   - Shared roadmaps
   - Group challenges
   - Leaderboard per group

---

### Phase 3: Advanced AI (Q3 2025)

8. **AI Code Tutor**
   - Step-by-step code explanation
   - Line-by-line debugging
   - Interactive problem-solving
   - Adaptive hints

9. **Voice-Activated Learning**
   - Voice commands for navigation
   - Verbal code explanations
   - Hands-free coding practice

10. **Smart Recommendations**
    - Suggest next topics based on progress
    - Recommend videos based on learning style
    - Personalized challenge difficulty

---

### Phase 4: Mobile & Offline (Q4 2025)

11. **Mobile Apps**
    - iOS app (React Native)
    - Android app (React Native)
    - Offline mode
    - Push notifications

12. **Offline Learning**
    - Download roadmaps
    - Cached videos
    - Offline code editor
    - Sync when online

---

### Phase 5: Enterprise Features (2026)

13. **Team Accounts**
    - Company dashboard
    - Bulk user management
    - Custom roadmaps for teams
    - Progress reports

14. **Custom Content**
    - Upload company-specific tutorials
    - Private challenges
    - Branded certification

15. **API Access**
    - Public API for integrations
    - Webhooks
    - LMS integration (Moodle, Canvas)

---

## 📞 Contact & Support

**GitHub Repository:** https://github.com/BALAJIBHARGAV6/Edu-Path

**Live Platform:**
- Frontend: https://edu-path-learn.vercel.app
- Backend API: https://edu-path.onrender.com

**Tech Stack:**
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: Supabase (PostgreSQL)
- AI: Groq (Llama 3.3 70B)

---

## 📜 License

MIT License - Feel free to use, modify, and distribute this project.

---

## 🙏 Acknowledgments

- **Groq** for ultra-fast AI inference
- **Supabase** for database and authentication
- **Vercel** for frontend hosting
- **Render** for backend hosting
- **Meta AI** for Llama 3.3 model
- **Open-source community** for amazing tools

---

**Last Updated:** December 16, 2025
**Version:** 1.0.0
**Author:** Balaji Bhargav
