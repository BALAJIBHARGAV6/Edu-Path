'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, Sparkles, Search, Download, RefreshCw,
  BookOpen, Clock, ChevronRight, Loader2, Copy, Check
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/lib/store'
import PageWrapper from '@/components/PageWrapper'
import GradientText from '@/components/GradientText'
import toast from 'react-hot-toast'

const PRIMARY = '#3B82F6'

// Topics organized by skill area
const topicLibrary: Record<string, any[]> = {
  'JavaScript': [
    { id: 1, title: 'JavaScript Fundamentals', category: 'Basics' },
    { id: 2, title: 'ES6+ Features', category: 'Modern JS' },
    { id: 3, title: 'Async/Await & Promises', category: 'Async' },
  ],
  'React': [
    { id: 4, title: 'React Hooks Deep Dive', category: 'Hooks' },
    { id: 5, title: 'State Management', category: 'State' },
    { id: 6, title: 'React Performance', category: 'Optimization' },
  ],
  'CSS': [
    { id: 7, title: 'CSS Grid & Flexbox', category: 'Layout' },
    { id: 8, title: 'Responsive Design', category: 'Mobile' },
    { id: 9, title: 'CSS Animations', category: 'Animation' },
  ],
  'TypeScript': [
    { id: 10, title: 'TypeScript Essentials', category: 'Basics' },
    { id: 11, title: 'Advanced Types', category: 'Types' },
  ],
  'Node.js': [
    { id: 12, title: 'Node.js Basics', category: 'Backend' },
    { id: 13, title: 'REST API Design', category: 'APIs' },
  ],
  'General': [
    { id: 14, title: 'Git Version Control', category: 'Tools' },
    { id: 15, title: 'Clean Code Principles', category: 'Best Practices' },
    { id: 16, title: 'Data Structures', category: 'CS Fundamentals' },
  ]
}

export default function ResourcesPage() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { currentRoadmap } = useStore()
  const isDark = theme === 'dark'
  const [search, setSearch] = useState('')
  const [generating, setGenerating] = useState<number | null>(null)
  const [generatedNotes, setGeneratedNotes] = useState<Record<number, string>>({})
  const [selectedTopic, setSelectedTopic] = useState<any | null>(null)
  const [copied, setCopied] = useState(false)

  // Get user's learning topics from settings/profile
  const userSkills = ['JavaScript', 'React', 'CSS'] // This should come from user settings
  const roadmapTopics = userSkills

  // Get relevant topics based on user skills
  const getRecommendedTopics = () => {
    let topics: any[] = []
    
    // Prioritize user's selected skills
    if (userSkills.length > 0) {
      userSkills.forEach(skill => {
        if (topicLibrary[skill]) {
          topics = [...topics, ...topicLibrary[skill]]
        }
      })
    }
    
    // Add general topics if we don't have enough
    if (topics.length < 8) {
      Object.values(topicLibrary).forEach(topicGroup => {
        topics = [...topics, ...topicGroup]
      })
    }
    
    return Array.from(new Map(topics.map(t => [t.id, t])).values())
  }

  const allTopics = getRecommendedTopics()
  const filteredTopics = allTopics.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  const generateNotes = async (topic: any) => {
    setGenerating(topic.id)
    setSelectedTopic(topic)
    
    await new Promise(r => setTimeout(r, 2000))
    
    const notes = `# ${topic.title} - Complete Study Guide

## 📚 Overview
${topic.title} is a crucial technology in modern development that every developer should master. This comprehensive guide covers everything from basic concepts to advanced implementation patterns.

## 🎯 Why Learn ${topic.title}?
- **High Demand**: Companies worldwide seek skilled ${topic.title} developers
- **Versatility**: Used across frontend, backend, and mobile development
- **Career Growth**: Opens doors to senior positions and higher salaries
- **Future-Proof**: Continuously evolving with modern trends

## 🔧 Core Concepts

### 1. Fundamentals
Understanding the basic principles and architecture patterns that make ${topic.title} powerful and efficient.

### 2. Component Architecture
Everything is built as reusable, modular components that can be composed together.

### 3. State Management
Centralized state handling for complex applications with predictable data flow.

## 💻 Code Examples

### Basic Implementation
\`\`\`javascript
// Example ${topic.title} component
import React, { useState, useEffect } from 'react';

const ExampleComponent = ({ data }) => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data or perform side effects
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetch('/api/data');
        const json = await result.json();
        setState(json);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="example-component">
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      {state && (
        <ul>
          {state.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExampleComponent;
\`\`\`

### Advanced Pattern
\`\`\`javascript
// Custom hook for data fetching
const useApiData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error };
};

// Usage in component
const DataComponent = () => {
  const { data, loading, error } = useApiData('/api/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};
\`\`\`

## ✅ Best Practices

### Performance Optimization
1. **Lazy Loading**: Load components only when needed
2. **Memoization**: Use React.memo, useMemo, useCallback
3. **Code Splitting**: Split bundles by routes or features
4. **Image Optimization**: Use modern formats and lazy loading

### Code Organization
1. **Single Responsibility**: Each component has one clear purpose
2. **DRY Principle**: Don't repeat yourself
3. **Consistent Naming**: Use descriptive names
4. **File Structure**: Organize by feature or type

### Security
1. **Input Validation**: Always validate user inputs
2. **XSS Prevention**: Sanitize data before rendering
3. **Authentication**: Use secure auth methods
4. **HTTPS**: Always use HTTPS in production

## 🚨 Common Pitfalls

### Memory Leaks
\`\`\`javascript
// ❌ Bad: Memory leak
useEffect(() => {
  const handleScroll = () => console.log('scrolling');
  window.addEventListener('scroll', handleScroll);
  // Missing cleanup!
}, []);

// ✅ Good: Proper cleanup
useEffect(() => {
  const handleScroll = () => console.log('scrolling');
  window.addEventListener('scroll', handleScroll);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
\`\`\`

### Infinite Re-renders
\`\`\`javascript
// ❌ Bad: Causes infinite loop
const [data, setData] = useState([]);
useEffect(() => {
  setData([...data, newItem]);
}, [data]); // data dependency causes loop

// ✅ Good: Use functional update
useEffect(() => {
  setData(prevData => [...prevData, newItem]);
}, []); // No dependency needed
\`\`\`

## 🏗️ Real-world Applications

### E-commerce Platform
\`\`\`javascript
const EcommerceDashboard = () => {
  const { data: products } = useProducts();
  const { data: orders } = useOrders();
  const { data: analytics } = useAnalytics();

  return (
    <Dashboard>
      <MetricsGrid>
        <ProductMetrics data={products} />
        <OrderMetrics data={orders} />
        <AnalyticsChart data={analytics} />
      </MetricsGrid>
      
      <RecentActivity />
    </Dashboard>
  );
};
\`\`\`

## 🔧 Testing

### Unit Testing
\`\`\`javascript
import { render, screen, fireEvent } from '@testing-library/react';
import ExampleComponent from './ExampleComponent';

test('renders component correctly', () => {
  const mockData = { title: 'Test', description: 'Test desc' };
  render(<ExampleComponent data={mockData} />);
  
  expect(screen.getByText('Test')).toBeInTheDocument();
  expect(screen.getByText('Test desc')).toBeInTheDocument();
});

test('handles user interaction', async () => {
  render(<ExampleComponent />);
  
  const button = screen.getByRole('button');
  fireEvent.click(button);
  
  expect(screen.getByText('Clicked!')).toBeInTheDocument();
});
\`\`\`

## 📚 Tools & Resources

### Development Tools
- **VS Code**: Best editor with extensions
- **React DevTools**: Browser debugging
- **ESLint/Prettier**: Code quality
- **Jest/Testing Library**: Testing framework

### Libraries
- **UI**: Material-UI, Chakra UI, Ant Design
- **Styling**: Styled-components, Tailwind CSS
- **State**: Redux Toolkit, Zustand
- **Routing**: React Router, Next.js
- **Forms**: React Hook Form, Formik

## 🎯 Project Ideas

### Beginner
1. **Todo App**: CRUD operations with local storage
2. **Weather App**: API integration
3. **Calculator**: State management
4. **Portfolio**: Routing and responsive design

### Intermediate
1. **Blog Platform**: Full CRUD with auth
2. **E-commerce**: Shopping cart and payments
3. **Chat App**: Real-time with WebSockets
4. **Dashboard**: Data visualization

### Advanced
1. **Social Platform**: Complex state and real-time
2. **Project Management**: Drag-and-drop, collaboration
3. **Video Platform**: Media handling and optimization
4. **SaaS Application**: Multi-tenant architecture

## 🚀 Next Steps

1. **Practice Daily**: Build projects to reinforce learning
2. **Read Docs**: Stay updated with official documentation
3. **Join Community**: Engage with other developers
4. **Open Source**: Contribute to projects
5. **Build Portfolio**: Showcase your skills

## 📖 Resources

- Official Documentation
- Community Forums
- Video Tutorials
- Code Examples
- Best Practices Guides

---

**Remember**: Mastering ${topic.title} takes time and practice. Stay consistent, build projects, and never stop learning!`

    setGeneratedNotes(prev => ({ ...prev, [topic.id]: notes }))
    setGenerating(null)
    toast.success('Notes generated!')
  }

  const copyNotes = () => {
    if (selectedTopic && generatedNotes[selectedTopic.id]) {
      navigator.clipboard.writeText(generatedNotes[selectedTopic.id])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Copied!')
    }
  }

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  return (
    <PageWrapper>
      <div className="min-h-screen pt-16 sm:pt-20 md:pt-24" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            style={{ 
              background: 'rgba(37,99,235,0.1)',
              border: '1px solid rgba(37,99,235,0.2)'
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: accent }} />
            <span className="text-sm font-medium" style={{ color: accent }}>AI-Powered Study Notes</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ color: text }}>
            Master concepts with <GradientText>smart resources</GradientText>
          </h1>
          
          <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-8" style={{ color: muted }}>
            Generate AI-powered study notes for any topic. Get personalized explanations, examples, and practice materials tailored to your learning style.
          </p>
        </motion.div>

        {/* Personalized Banner */}
        {roadmapTopics.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Personalized Topics</h3>
                <p className="text-blue-100 text-sm">
                  Curated for: <strong className="text-white">{roadmapTopics.slice(0, 3).join(', ')}</strong>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Topics Sidebar */}
          <div className="lg:col-span-1">
            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-blue-500" style={{ color: muted }} />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all border-0 focus:ring-2 focus:ring-blue-500/30 focus:scale-[1.02]"
                  style={{ 
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    color: text
                  }}
                />
              </div>
            </motion.div>

            {/* Topics List */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-1">
              <h3 className="text-xs uppercase tracking-wider font-bold mb-3 opacity-60" style={{ color: text }}>Topics</h3>
              {filteredTopics.map((topic, i) => (
                <motion.button
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i }}
                  onClick={() => generatedNotes[topic.id] ? setSelectedTopic(topic) : generateNotes(topic)}
                  disabled={generating === topic.id}
                  className="w-full group flex items-center gap-3 p-3 rounded-lg text-left transition-all hover:translate-x-1"
                  style={{ 
                    background: selectedTopic?.id === topic.id ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)' : 'transparent',
                    color: selectedTopic?.id === topic.id ? '#fff' : text
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all" 
                    style={{ 
                      background: selectedTopic?.id === topic.id ? 'rgba(255,255,255,0.2)' : (isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)'),
                    }}
                  >
                    {generating === topic.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: selectedTopic?.id === topic.id ? '#fff' : '#3B82F6' }} />
                    ) : (
                      <FileText className="w-4 h-4" style={{ color: selectedTopic?.id === topic.id ? '#fff' : '#3B82F6' }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {topic.title}
                    </p>
                    <p className="text-xs opacity-70">{topic.category}</p>
                  </div>
                  {generatedNotes[topic.id] && (
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            {selectedTopic && generatedNotes[selectedTopic.id] ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{selectedTopic.title}</h2>
                        <p className="text-blue-100 text-sm">AI-generated study notes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={copyNotes} 
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4 text-white" />}
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => generateNotes(selectedTopic)} 
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
                      >
                        <RefreshCw className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-gray-50 dark:bg-gray-800 p-4 rounded-lg" style={{ color: text }}>
                      {generatedNotes[selectedTopic.id]}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 h-96 flex flex-col items-center justify-center text-center p-8">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                >
                  <FileText className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: text }}>Select a Topic</h3>
                <p className="text-base max-w-md leading-relaxed opacity-70" style={{ color: muted }}>
                  Choose any topic from the sidebar to generate comprehensive AI-powered study notes instantly.
                </p>
              </div>
            )}
          </motion.div>
        </div>
        </div>
      </div>
    </PageWrapper>
  )
}
