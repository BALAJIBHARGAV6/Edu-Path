# EduPath AI - Personalized Learning Platform

An AI-powered personalized education platform with separate frontend and backend architecture.

## Project Structure

```
E-Learning Platform/
├── frontend/          # Next.js 14 Frontend
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/# React components
│   │   └── lib/       # Utilities & store
│   └── package.json
├── backend/           # Express.js API Server
│   ├── src/
│   │   ├── routes/    # API routes
│   │   └── config/    # Supabase & Groq config
│   └── package.json
└── supabase/          # Database schema
    └── schema.sql
```

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:5000

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000

### 3. Database Setup
Run `supabase/schema.sql` in your Supabase SQL Editor.

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Three.js (3D backgrounds)
- Framer Motion
- Zustand

**Backend:**
- Express.js
- TypeScript
- Groq AI (llama-3.3-70b)
- Supabase

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/roadmap/generate` | POST | Generate AI roadmap |
| `/api/videos/search` | GET | Search YouTube videos |
| `/api/users/profile` | POST | Create/update profile |
| `/api/progress/topic` | POST | Update topic progress |

## Environment Variables

### Backend (.env)
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY`
- `YOUTUBE_API_KEY`

### Frontend (.env.local)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`
