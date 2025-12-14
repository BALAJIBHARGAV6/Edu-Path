'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, Code2, Server, Smartphone, Palette, 
  Database, Globe, Shield, Sparkles, CheckCircle2,
  Clock, Users, TrendingUp, Star, Play, ChevronRight,
  Brain, Target, Zap, Award, Plus, Cpu, Cloud, 
  BarChart3, Gamepad2, Camera, Music, Briefcase, 
  BookOpen, Wrench, PenTool, Layers, Monitor, ChevronDown, Check
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useStore } from '@/lib/store'
import { useAuth } from '@/context/AuthContext'
import PageWrapper from '@/components/PageWrapper'
import GradientText from '@/components/GradientText'
import toast from 'react-hot-toast'

// Comprehensive domains and stacks database
const domains = [
  {
    id: 'web-development',
    name: 'Web Development',
    icon: Code2,
    color: '#3B82F6',
    description: 'Build modern web applications',
    stacks: [
      {
        id: 1,
        name: 'Frontend Development',
        icon: Monitor,
        description: 'Create beautiful, interactive user interfaces',
        skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS'],
        difficulty: 'Beginner to Advanced',
        duration: '3-6 months',
        popularity: 95,
        projects: ['Portfolio Website', 'E-commerce Site', 'Dashboard App']
      },
      {
        id: 2,
        name: 'Backend Development',
        icon: Server,
        description: 'Build robust server-side applications',
        skills: ['Node.js', 'Python', 'Express.js', 'Django', 'FastAPI', 'MongoDB', 'PostgreSQL', 'REST APIs'],
        difficulty: 'Intermediate',
        duration: '4-8 months',
        popularity: 88,
        projects: ['REST API', 'Microservices', 'Real-time Chat App']
      },
      {
        id: 3,
        name: 'Full Stack Development',
        icon: Layers,
        description: 'Master both frontend and backend',
        skills: ['React', 'Node.js', 'MongoDB', 'Express.js', 'Next.js', 'TypeScript', 'GraphQL', 'AWS'],
        difficulty: 'Intermediate to Advanced',
        duration: '6-12 months',
        popularity: 92,
        projects: ['Social Media App', 'E-learning Platform', 'SaaS Application']
      }
    ]
  },
  {
    id: 'mobile-development',
    name: 'Mobile Development',
    icon: Smartphone,
    color: '#8B5CF6',
    description: 'Create mobile applications',
    stacks: [
      {
        id: 4,
        name: 'React Native',
        icon: Smartphone,
        description: 'Cross-platform mobile development',
        skills: ['React Native', 'JavaScript', 'TypeScript', 'Expo', 'Firebase', 'Redux', 'Navigation'],
        difficulty: 'Intermediate',
        duration: '4-8 months',
        popularity: 85,
        projects: ['Social App', 'E-commerce App', 'Fitness Tracker']
      },
      {
        id: 5,
        name: 'Flutter Development',
        icon: Smartphone,
        description: 'Google\'s UI toolkit for mobile',
        skills: ['Dart', 'Flutter', 'Firebase', 'State Management', 'Material Design', 'iOS/Android'],
        difficulty: 'Intermediate',
        duration: '4-8 months',
        popularity: 78,
        projects: ['Chat App', 'Food Delivery App', 'Weather App']
      },
      {
        id: 6,
        name: 'Native iOS',
        icon: Smartphone,
        description: 'Native iOS app development',
        skills: ['Swift', 'SwiftUI', 'UIKit', 'Core Data', 'Xcode', 'App Store', 'iOS SDK'],
        difficulty: 'Advanced',
        duration: '6-10 months',
        popularity: 72,
        projects: ['iOS Game', 'Productivity App', 'AR App']
      }
    ]
  },
  {
    id: 'data-ai',
    name: 'Data & AI',
    icon: Database,
    color: '#EF4444',
    description: 'Work with data and artificial intelligence',
    stacks: [
      {
        id: 7,
        name: 'Data Science',
        icon: BarChart3,
        description: 'Extract insights from data',
        skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'Jupyter', 'SQL', 'Statistics'],
        difficulty: 'Intermediate to Advanced',
        duration: '6-12 months',
        popularity: 85,
        projects: ['Sales Analytics', 'Recommendation System', 'Predictive Model']
      },
      {
        id: 8,
        name: 'Machine Learning',
        icon: Brain,
        description: 'Build intelligent systems',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Keras', 'Deep Learning', 'NLP', 'Computer Vision'],
        difficulty: 'Advanced',
        duration: '8-15 months',
        popularity: 88,
        projects: ['Image Classifier', 'Chatbot', 'Fraud Detection']
      },
      {
        id: 9,
        name: 'Data Engineering',
        icon: Database,
        description: 'Build data pipelines and infrastructure',
        skills: ['Python', 'Apache Spark', 'Kafka', 'Airflow', 'SQL', 'ETL', 'Big Data', 'Cloud'],
        difficulty: 'Advanced',
        duration: '6-12 months',
        popularity: 75,
        projects: ['Data Pipeline', 'Real-time Analytics', 'Data Warehouse']
      }
    ]
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    icon: Cloud,
    color: '#06B6D4',
    description: 'Manage cloud infrastructure and deployments',
    stacks: [
      {
        id: 10,
        name: 'AWS Cloud',
        icon: Cloud,
        description: 'Amazon Web Services cloud platform',
        skills: ['EC2', 'S3', 'Lambda', 'RDS', 'CloudFormation', 'IAM', 'VPC', 'CloudWatch'],
        difficulty: 'Intermediate to Advanced',
        duration: '4-8 months',
        popularity: 90,
        projects: ['Serverless App', 'Auto-scaling Web App', 'Data Lake']
      },
      {
        id: 11,
        name: 'DevOps Engineering',
        icon: Wrench,
        description: 'Automate deployment and operations',
        skills: ['Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'Terraform', 'Ansible', 'Monitoring'],
        difficulty: 'Advanced',
        duration: '6-12 months',
        popularity: 82,
        projects: ['CI/CD Pipeline', 'Container Orchestration', 'Infrastructure as Code']
      },
      {
        id: 12,
        name: 'Site Reliability Engineering',
        icon: Shield,
        description: 'Ensure system reliability and performance',
        skills: ['Linux', 'Monitoring', 'Incident Response', 'SLI/SLO', 'Prometheus', 'Grafana', 'Automation'],
        difficulty: 'Advanced',
        duration: '8-12 months',
        popularity: 75,
        projects: ['Monitoring System', 'Disaster Recovery', 'Performance Optimization']
      }
    ]
  },
  {
    id: 'design',
    name: 'Design',
    icon: Palette,
    color: '#F59E0B',
    description: 'Create beautiful and functional designs',
    stacks: [
      {
        id: 13,
        name: 'UI/UX Design',
        icon: PenTool,
        description: 'Design user-centered experiences',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'Design Systems', 'Usability'],
        difficulty: 'Beginner to Advanced',
        duration: '3-6 months',
        popularity: 78,
        projects: ['Mobile App Design', 'Website Redesign', 'Design System']
      },
      {
        id: 14,
        name: 'Graphic Design',
        icon: Camera,
        description: 'Create visual content and branding',
        skills: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Branding', 'Typography', 'Color Theory'],
        difficulty: 'Beginner to Intermediate',
        duration: '2-4 months',
        popularity: 65,
        projects: ['Logo Design', 'Brand Identity', 'Marketing Materials']
      }
    ]
  },
  {
    id: 'game-development',
    name: 'Game Development',
    icon: Gamepad2,
    color: '#7C3AED',
    description: 'Create interactive games and experiences',
    stacks: [
      {
        id: 15,
        name: 'Unity Game Development',
        icon: Gamepad2,
        description: 'Build 2D and 3D games with Unity',
        skills: ['Unity', 'C#', 'Game Physics', '3D Modeling', 'Animation', 'Game Design', 'Publishing'],
        difficulty: 'Intermediate to Advanced',
        duration: '6-12 months',
        popularity: 70,
        projects: ['2D Platformer', '3D Adventure Game', 'Mobile Game']
      },
      {
        id: 16,
        name: 'Web Game Development',
        icon: Globe,
        description: 'Create browser-based games',
        skills: ['JavaScript', 'HTML5 Canvas', 'WebGL', 'Three.js', 'Phaser.js', 'Game Logic'],
        difficulty: 'Intermediate',
        duration: '4-8 months',
        popularity: 60,
        projects: ['Browser Game', 'Multiplayer Game', 'Educational Game']
      }
    ]
  },
  {
    id: 'business',
    name: 'Business & Marketing',
    icon: Briefcase,
    color: '#10B981',
    description: 'Develop business and marketing skills',
    stacks: [
      {
        id: 17,
        name: 'Digital Marketing',
        icon: TrendingUp,
        description: 'Master online marketing strategies',
        skills: ['SEO', 'Social Media', 'Google Ads', 'Content Marketing', 'Analytics', 'Email Marketing'],
        difficulty: 'Beginner to Intermediate',
        duration: '2-4 months',
        popularity: 80,
        projects: ['SEO Campaign', 'Social Media Strategy', 'Content Calendar']
      },
      {
        id: 18,
        name: 'Product Management',
        icon: Target,
        description: 'Lead product development and strategy',
        skills: ['Product Strategy', 'User Research', 'Roadmapping', 'Analytics', 'A/B Testing', 'Agile'],
        difficulty: 'Intermediate to Advanced',
        duration: '4-8 months',
        popularity: 75,
        projects: ['Product Launch', 'Feature Roadmap', 'User Journey Map']
      }
    ]
  }
]

const levelDetails = {
  beginner: { title: 'Beginner', subtitle: 'Start from scratch', icon: BookOpen, color: '#3B82F6' },
  intermediate: { title: 'Intermediate', subtitle: 'Build on fundamentals', icon: Target, color: '#06B6D4' },
  advanced: { title: 'Advanced', subtitle: 'Master advanced concepts', icon: Zap, color: '#8B5CF6' }
}

export default function RoadmapsPage() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const { currentRoadmap } = useStore()
  const isDark = theme === 'dark'
  
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedStack, setSelectedStack] = useState<any | null>(null)
  const [showLevelModal, setShowLevelModal] = useState(false)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customGoal, setCustomGoal] = useState('')
  const [customLevel, setCustomLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [generating, setGenerating] = useState(false)
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any>(null)
  const [showRoadmapView, setShowRoadmapView] = useState(false)
  const [expandedConcepts, setExpandedConcepts] = useState<number[]>([])
  const [completedConcepts, setCompletedConcepts] = useState<number[]>([])
  const [currentLevel, setCurrentLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')

  // Scroll to top when roadmap view is shown
  useEffect(() => {
    if (showRoadmapView) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [showRoadmapView])

  // Check if all concepts are completed and auto-progress to next level
  useEffect(() => {
    if (generatedRoadmap && completedConcepts.length === generatedRoadmap.concepts.length && completedConcepts.length > 0) {
      const nextLevel = currentLevel === 'beginner' ? 'intermediate' : currentLevel === 'intermediate' ? 'advanced' : null
      
      if (nextLevel) {
        toast.success(`🎉 ${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} level completed!`, { duration: 3000 })
        
        setTimeout(() => {
          toast.success(`🚀 Generating ${nextLevel} level roadmap...`, { duration: 2000 })
          setCompletedConcepts([])
          setExpandedConcepts([])
          generateRoadmapForLevel(nextLevel, generatedRoadmap.stack)
        }, 2000)
      } else {
        toast.success('🏆 Congratulations! You have mastered all levels!', { duration: 5000 })
      }
    }
  }, [completedConcepts, generatedRoadmap])

  const toggleConcept = (conceptId: number) => {
    setExpandedConcepts(prev => 
      prev.includes(conceptId) 
        ? prev.filter(id => id !== conceptId)
        : [...prev, conceptId]
    )
  }

  const markConceptComplete = (conceptId: number) => {
    setCompletedConcepts(prev => {
      if (prev.includes(conceptId)) {
        toast.success('Concept unmarked')
        return prev.filter(id => id !== conceptId)
      } else {
        toast.success('✅ Concept completed!')
        return [...prev, conceptId]
      }
    })
  }

  // Level-specific concepts generator
  const getLevelConcepts = (stackName: string, level: 'beginner' | 'intermediate' | 'advanced') => {
    const conceptsByLevel = {
      beginner: [
        { 
          id: 1, 
          name: `Introduction to ${stackName}`, 
          description: 'Get started with the basics and understand what it is', 
          subTopics: [
            `What is ${stackName} and why use it`,
            'History and evolution',
            'Use cases and applications',
            'Comparing with alternatives',
            'Setting expectations and goals'
          ]
        },
        { 
          id: 2, 
          name: 'Development Environment Setup', 
          description: 'Install and configure all required tools', 
          subTopics: [
            'Installing required software',
            'Setting up VS Code or preferred IDE',
            'Configuring extensions and plugins',
            'Terminal and command line basics',
            'Creating your first project folder'
          ]
        },
        { 
          id: 3, 
          name: 'Basic Syntax & Structure', 
          description: 'Learn the fundamental syntax rules', 
          subTopics: [
            'Basic syntax and keywords',
            'Code structure and formatting',
            'Comments and documentation',
            'Naming conventions',
            'Writing your first code'
          ]
        },
        { 
          id: 4, 
          name: 'Variables & Data Types', 
          description: 'Understand how to store and manage data', 
          subTopics: [
            'Declaring variables',
            'Primitive data types (strings, numbers)',
            'Boolean and null values',
            'Type checking basics',
            'Variable naming best practices'
          ]
        },
        { 
          id: 5, 
          name: 'Basic Operators', 
          description: 'Learn arithmetic and comparison operators', 
          subTopics: [
            'Arithmetic operators (+, -, *, /)',
            'Comparison operators (==, !=, <, >)',
            'Assignment operators',
            'String concatenation',
            'Operator precedence'
          ]
        },
        { 
          id: 6, 
          name: 'Conditional Statements', 
          description: 'Make decisions in your code', 
          subTopics: [
            'If statements',
            'If-else conditions',
            'Else-if chains',
            'Ternary operators',
            'Simple decision making'
          ]
        },
        { 
          id: 7, 
          name: 'Basic Loops', 
          description: 'Repeat actions with loops', 
          subTopics: [
            'For loops basics',
            'While loops',
            'Loop counters',
            'Breaking out of loops',
            'Simple iterations'
          ]
        },
        { 
          id: 8, 
          name: 'Simple Functions', 
          description: 'Create reusable code blocks', 
          subTopics: [
            'What are functions',
            'Creating simple functions',
            'Calling functions',
            'Function parameters basics',
            'Return statements'
          ]
        },
        { 
          id: 9, 
          name: 'Basic Input/Output', 
          description: 'Handle user input and display output', 
          subTopics: [
            'Printing output',
            'Reading user input',
            'Simple prompts',
            'Displaying messages',
            'Basic formatting'
          ]
        },
        { 
          id: 10, 
          name: 'Your First Project', 
          description: 'Build a simple beginner project', 
          subTopics: [
            'Project planning',
            'Applying learned concepts',
            'Building step by step',
            'Testing your code',
            'Celebrating your achievement'
          ]
        }
      ],
      intermediate: [
        { 
          id: 1, 
          name: 'Advanced Data Structures', 
          description: 'Master arrays, objects, and collections', 
          subTopics: [
            'Arrays and array methods',
            'Objects and properties',
            'Maps and Sets',
            'Nested data structures',
            'Data manipulation techniques'
          ]
        },
        { 
          id: 2, 
          name: 'Advanced Functions', 
          description: 'Deep dive into function patterns', 
          subTopics: [
            'Arrow functions',
            'Callback functions',
            'Closures and scope',
            'Higher-order functions',
            'Function composition'
          ]
        },
        { 
          id: 3, 
          name: 'Error Handling', 
          description: 'Gracefully handle errors and exceptions', 
          subTopics: [
            'Try-catch blocks',
            'Throwing errors',
            'Custom error types',
            'Error propagation',
            'Debugging strategies'
          ]
        },
        { 
          id: 4, 
          name: 'Asynchronous Programming', 
          description: 'Handle async operations effectively', 
          subTopics: [
            'Callbacks in depth',
            'Promises',
            'Async/await syntax',
            'Error handling in async code',
            'Parallel vs sequential execution'
          ]
        },
        { 
          id: 5, 
          name: 'Modules & Imports', 
          description: 'Organize code into modules', 
          subTopics: [
            'Module systems',
            'Import and export',
            'Default vs named exports',
            'Module organization',
            'Dependency management'
          ]
        },
        { 
          id: 6, 
          name: 'Working with APIs', 
          description: 'Fetch and send data to APIs', 
          subTopics: [
            'HTTP methods',
            'Fetch API',
            'Handling responses',
            'API authentication basics',
            'Error handling for APIs'
          ]
        },
        { 
          id: 7, 
          name: 'State Management', 
          description: 'Manage application state effectively', 
          subTopics: [
            'State concepts',
            'Local vs global state',
            'State patterns',
            'Immutability',
            'State debugging'
          ]
        },
        { 
          id: 8, 
          name: 'Testing Fundamentals', 
          description: 'Write tests for your code', 
          subTopics: [
            'Why testing matters',
            'Unit testing basics',
            'Test frameworks',
            'Writing test cases',
            'Running and debugging tests'
          ]
        },
        { 
          id: 9, 
          name: 'Version Control with Git', 
          description: 'Master Git for collaboration', 
          subTopics: [
            'Branching strategies',
            'Merging and rebasing',
            'Resolving conflicts',
            'Pull requests',
            'Git workflows'
          ]
        },
        { 
          id: 10, 
          name: 'Intermediate Project', 
          description: 'Build a full-featured application', 
          subTopics: [
            'Project architecture',
            'Implementing features',
            'API integration',
            'Error handling',
            'Code review preparation'
          ]
        }
      ],
      advanced: [
        { 
          id: 1, 
          name: 'Design Patterns', 
          description: 'Master software design patterns', 
          subTopics: [
            'Creational patterns',
            'Structural patterns',
            'Behavioral patterns',
            'Pattern selection criteria',
            'Real-world applications'
          ]
        },
        { 
          id: 2, 
          name: 'Performance Optimization', 
          description: 'Optimize for speed and efficiency', 
          subTopics: [
            'Profiling and benchmarking',
            'Memory optimization',
            'Algorithm efficiency',
            'Caching strategies',
            'Lazy loading'
          ]
        },
        { 
          id: 3, 
          name: 'Security Best Practices', 
          description: 'Secure your applications', 
          subTopics: [
            'Common vulnerabilities',
            'Input validation',
            'Authentication patterns',
            'Authorization strategies',
            'Security auditing'
          ]
        },
        { 
          id: 4, 
          name: 'Advanced Architecture', 
          description: 'Design scalable systems', 
          subTopics: [
            'Clean architecture',
            'Microservices concepts',
            'Event-driven design',
            'Domain-driven design',
            'Scalability patterns'
          ]
        },
        { 
          id: 5, 
          name: 'Advanced Testing', 
          description: 'Comprehensive testing strategies', 
          subTopics: [
            'Integration testing',
            'End-to-end testing',
            'Mocking and stubbing',
            'Test coverage optimization',
            'CI/CD testing pipelines'
          ]
        },
        { 
          id: 6, 
          name: 'DevOps & Deployment', 
          description: 'Deploy and manage applications', 
          subTopics: [
            'Containerization with Docker',
            'CI/CD pipelines',
            'Cloud deployment',
            'Monitoring and logging',
            'Infrastructure as code'
          ]
        },
        { 
          id: 7, 
          name: 'Code Quality & Review', 
          description: 'Maintain high code quality', 
          subTopics: [
            'Code review best practices',
            'Linting and formatting',
            'Documentation standards',
            'Refactoring techniques',
            'Technical debt management'
          ]
        },
        { 
          id: 8, 
          name: 'Team Collaboration', 
          description: 'Work effectively in teams', 
          subTopics: [
            'Agile methodologies',
            'Code collaboration tools',
            'Communication skills',
            'Mentoring juniors',
            'Technical leadership'
          ]
        },
        { 
          id: 9, 
          name: 'System Design', 
          description: 'Design complex systems', 
          subTopics: [
            'System design principles',
            'Database design',
            'API design',
            'Load balancing',
            'Disaster recovery'
          ]
        },
        { 
          id: 10, 
          name: 'Production-Ready Project', 
          description: 'Build enterprise-level application', 
          subTopics: [
            'Production architecture',
            'Performance tuning',
            'Security implementation',
            'Monitoring setup',
            'Documentation and handoff'
          ]
        }
      ]
    }
    
    return conceptsByLevel[level].map(c => ({ ...c, isCompleted: false, category: level.charAt(0).toUpperCase() + level.slice(1) }))
  }

  const generateRoadmapForLevel = async (level: 'beginner' | 'intermediate' | 'advanced', stack: any) => {
    setGenerating(true)
    setCurrentLevel(level)
    
    await new Promise(r => setTimeout(r, 1500))
    
    const newRoadmap = {
      id: Date.now(),
      stack: stack,
      level: level,
      title: `${stack.name} - ${level.charAt(0).toUpperCase() + level.slice(1)} Path`,
      description: `Complete ${stack.name} learning path for ${level} developers`,
      estimatedWeeks: level === 'beginner' ? 4 : level === 'intermediate' ? 8 : 12,
      concepts: getLevelConcepts(stack.name, level)
    }
    
    setGeneratedRoadmap(newRoadmap)
    setGenerating(false)
    setShowRoadmapView(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#2563EB'

  const allStacks = domains.flatMap(domain => domain.stacks)

  const handleStackClick = (stack: any) => {
    setSelectedStack(stack)
    setShowLevelModal(true)
  }

  const handleCustomRoadmap = () => {
    setShowCustomModal(true)
  }

  const generateCustomRoadmap = async () => {
    if (!customGoal.trim()) return
    
    setGenerating(true)
    setShowCustomModal(false)
    
    // Simulate AI roadmap generation for custom goal
    await new Promise(r => setTimeout(r, 2000))
    
    const customRoadmap = {
      id: Date.now(),
      stack: { name: customGoal, icon: Target },
      level: customLevel,
      title: `${customGoal} - Custom Learning Path`,
      description: `Personalized roadmap to master ${customGoal}`,
      estimatedWeeks: 12,
      concepts: [
        { 
          id: 1, 
          name: `${customGoal} Fundamentals`, 
          description: 'Learn the basic concepts and principles', 
          isCompleted: false, 
          category: 'Basics',
          subTopics: [
            `Introduction to ${customGoal}`,
            'Core concepts and terminology',
            'Basic principles and foundations',
            'Getting started guide',
            'Essential tools setup'
          ]
        },
        { 
          id: 2, 
          name: 'Core Skills Development', 
          description: 'Build essential skills and knowledge', 
          isCompleted: false, 
          category: 'Basics',
          subTopics: [
            'Fundamental techniques',
            'Building blocks mastery',
            'Hands-on exercises',
            'Skill assessment',
            'Practice projects'
          ]
        },
        { 
          id: 3, 
          name: 'Practical Application', 
          description: 'Apply concepts in real scenarios', 
          isCompleted: false, 
          category: 'Intermediate',
          subTopics: [
            'Real-world use cases',
            'Practical implementations',
            'Case study analysis',
            'Scenario-based learning',
            'Applied exercises'
          ]
        },
        { 
          id: 4, 
          name: 'Advanced Techniques', 
          description: 'Master advanced methods and strategies', 
          isCompleted: false, 
          category: 'Intermediate',
          subTopics: [
            'Advanced methodologies',
            'Complex problem solving',
            'Expert-level techniques',
            'Optimization strategies',
            'Industry best practices'
          ]
        },
        { 
          id: 5, 
          name: 'Problem Solving', 
          description: 'Develop critical thinking and solutions', 
          isCompleted: false, 
          category: 'Intermediate',
          subTopics: [
            'Analytical thinking',
            'Problem decomposition',
            'Solution design patterns',
            'Debugging strategies',
            'Critical analysis'
          ]
        },
        { 
          id: 6, 
          name: 'Best Practices', 
          description: 'Learn industry standards and conventions', 
          isCompleted: false, 
          category: 'Advanced',
          subTopics: [
            'Industry standards',
            'Code/work quality guidelines',
            'Professional conventions',
            'Maintenance strategies',
            'Documentation practices'
          ]
        },
        { 
          id: 7, 
          name: 'Optimization & Performance', 
          description: 'Improve efficiency and quality', 
          isCompleted: false, 
          category: 'Advanced',
          subTopics: [
            'Performance tuning',
            'Efficiency improvements',
            'Resource optimization',
            'Scalability techniques',
            'Monitoring and metrics'
          ]
        },
        { 
          id: 8, 
          name: 'Real-world Projects', 
          description: 'Build portfolio-worthy applications', 
          isCompleted: false, 
          category: 'Projects',
          subTopics: [
            'Project planning',
            'Full implementation',
            'Deployment strategies',
            'Portfolio presentation',
            'Project documentation'
          ]
        },
        { 
          id: 9, 
          name: 'Testing & Quality', 
          description: 'Ensure quality and reliability', 
          isCompleted: false, 
          category: 'Advanced',
          subTopics: [
            'Testing methodologies',
            'Quality assurance',
            'Validation techniques',
            'Error prevention',
            'Continuous improvement'
          ]
        },
        { 
          id: 10, 
          name: 'Professional Development', 
          description: 'Prepare for career advancement', 
          isCompleted: false, 
          category: 'Projects',
          subTopics: [
            'Career path planning',
            'Resume and portfolio',
            'Interview preparation',
            'Networking strategies',
            'Continuous learning'
          ]
        }
      ]
    }
    
    setGeneratedRoadmap(customRoadmap)
    setGenerating(false)
    setShowRoadmapView(true)
    setCustomGoal('')
  }

  const generateRoadmap = async (level: 'beginner' | 'intermediate' | 'advanced') => {
    if (!selectedStack) return
    
    setGenerating(true)
    setShowLevelModal(false)
    setCurrentLevel(level)
    setCompletedConcepts([])
    setExpandedConcepts([])
    
    // Simulate AI roadmap generation
    await new Promise(r => setTimeout(r, 2000))
    
    // Generate a level-specific roadmap with appropriate concepts
    const sampleRoadmap = {
      id: Date.now(),
      stack: selectedStack,
      level: level,
      title: `${selectedStack.name} - ${level.charAt(0).toUpperCase() + level.slice(1)} Path`,
      description: `Complete ${selectedStack.name} learning path for ${level} developers`,
      estimatedWeeks: level === 'beginner' ? 4 : level === 'intermediate' ? 8 : 12,
      concepts: getLevelConcepts(selectedStack.name, level)
    }
    
    setGeneratedRoadmap(sampleRoadmap)
    setGenerating(false)
    setShowRoadmapView(true)
    setSelectedStack(null)
  }

  return (
    <PageWrapper>
      <div className="min-h-screen pt-16 sm:pt-20 md:pt-24" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {generating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4" style={{ background: subtle, border: '1px solid ' + border }}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4" style={{ borderColor: accent, borderTopColor: 'transparent' }}></div>
                <h3 className="text-lg font-bold mb-2" style={{ color: text }}>Generating Your Roadmap</h3>
                <p className="text-sm" style={{ color: muted }}>Our AI is creating a personalized learning path for {selectedStack?.name}...</p>
              </div>
            </div>
          </div>
        )}

        {/* Roadmap View */}
        {showRoadmapView && generatedRoadmap ? (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <button 
                onClick={() => setShowRoadmapView(false)}
                className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity mb-6"
                style={{ color: accent }}
              >
                ← Back to Stacks
              </button>
              
              <div className="text-center mb-12">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: domains.find(d => d.stacks.includes(generatedRoadmap.stack))?.color + '20' }}>
                  <generatedRoadmap.stack.icon className="w-8 h-8" style={{ color: domains.find(d => d.stacks.includes(generatedRoadmap.stack))?.color }} />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: text }}>
                  {generatedRoadmap.title}
                </h1>
                <p className="text-base sm:text-lg" style={{ color: muted }}>
                  {generatedRoadmap.description} • {generatedRoadmap.estimatedWeeks} weeks
                </p>
              </div>

              {/* Level Progress Indicator */}
              <div className="mb-8 p-4 rounded-2xl" style={{ background: subtle, border: '1px solid ' + border }}>
                <div className="flex items-center justify-center gap-4">
                  {['beginner', 'intermediate', 'advanced'].map((level, idx) => {
                    const isActive = currentLevel === level
                    const isPassed = (currentLevel === 'intermediate' && level === 'beginner') || 
                                     (currentLevel === 'advanced' && (level === 'beginner' || level === 'intermediate'))
                    const levelColors = {
                      beginner: '#10B981',
                      intermediate: '#F59E0B',
                      advanced: '#EF4444'
                    }
                    
                    return (
                      <div key={level} className="flex items-center gap-2">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${isActive ? 'ring-4 ring-offset-2' : ''}`}
                          style={{ 
                            background: isActive || isPassed ? levelColors[level as keyof typeof levelColors] : muted + '30',
                            color: isActive || isPassed ? '#fff' : muted,
                            ringColor: isActive ? levelColors[level as keyof typeof levelColors] + '50' : 'transparent'
                          }}
                        >
                          {isPassed ? <Check className="w-5 h-5" /> : idx + 1}
                        </div>
                        <span 
                          className="text-sm font-medium hidden sm:block"
                          style={{ color: isActive ? levelColors[level as keyof typeof levelColors] : muted }}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </span>
                        {idx < 2 && (
                          <div 
                            className="w-8 sm:w-16 h-1 rounded-full mx-2"
                            style={{ background: isPassed || (isActive && level !== 'beginner') ? levelColors[level as keyof typeof levelColors] : muted + '30' }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
                <p className="text-center text-xs mt-3" style={{ color: muted }}>
                  Complete all {currentLevel} concepts to unlock the next level!
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8 p-4 rounded-2xl" style={{ background: accent + '10', border: '1px solid ' + accent + '30' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: accent }}>Learning Progress</span>
                  <span className="text-sm" style={{ color: muted }}>{completedConcepts.length} of {generatedRoadmap.concepts.length} concepts completed</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: muted + '30' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedConcepts.length / generatedRoadmap.concepts.length) * 100}%` }}
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ background: accent }} 
                  />
                </div>
              </div>

              {/* Concepts Grid */}
              <div className="grid gap-4">
                <h2 className="text-xl font-bold mb-4" style={{ color: text }}>10 Key Concepts to Master</h2>
                
                {generatedRoadmap.concepts.map((concept: any, i: number) => {
                  const categoryColors: Record<string, string> = {
                    'Setup': '#10B981',
                    'Basics': '#3B82F6', 
                    'Intermediate': '#F59E0B',
                    'Advanced': '#EF4444',
                    'Projects': '#8B5CF6'
                  }
                  const isExpanded = expandedConcepts.includes(concept.id)
                  const isCompleted = completedConcepts.includes(concept.id)
                  
                  return (
                    <motion.div
                      key={concept.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="rounded-xl overflow-hidden"
                      style={{
                        background: subtle,
                        border: '1px solid ' + border
                      }}
                    >
                      {/* Concept Header */}
                      <div className="flex items-center gap-4 p-4">
                        <button 
                          onClick={() => toggleConcept(concept.id)}
                          className="flex items-center gap-4 flex-1 text-left hover:opacity-80 transition-opacity"
                        >
                          {/* Number */}
                          <div 
                            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold ${isCompleted ? 'bg-emerald-500' : ''}`}
                            style={{ 
                              background: isCompleted ? '#10B981' : (categoryColors[concept.category] || accent) + '20',
                              color: isCompleted ? '#fff' : categoryColors[concept.category] || accent
                            }}
                          >
                            {isCompleted ? <Check className="w-5 h-5" /> : i + 1}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold text-sm ${isCompleted ? 'line-through opacity-60' : ''}`} style={{ color: text }}>
                                {concept.name}
                              </h3>
                              <span 
                                className="px-2 py-0.5 rounded text-xs font-medium"
                                style={{
                                  background: (categoryColors[concept.category] || accent) + '15',
                                  color: categoryColors[concept.category] || accent
                                }}
                              >
                                {concept.category}
                              </span>
                            </div>
                            <p className="text-xs" style={{ color: muted }}>
                              {concept.description}
                            </p>
                          </div>
                          
                          {/* Expand Icon */}
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: muted }} />
                          ) : (
                            <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: muted }} />
                          )}
                        </button>
                        
                        {/* Complete Button */}
                        <button
                          onClick={() => markConceptComplete(concept.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                              : 'text-white hover:opacity-90'
                          }`}
                          style={{ background: isCompleted ? '#10B981' : accent }}
                        >
                          {isCompleted ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Done
                            </span>
                          ) : (
                            'Complete'
                          )}
                        </button>
                      </div>
                      
                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-0 space-y-4" style={{ borderTop: '1px solid ' + border }}>
                              {/* Sub-topics to learn */}
                              <div className="pt-4">
                                <h4 className="text-sm font-semibold mb-3" style={{ color: text }}>📚 Topics to Master:</h4>
                                <div className="grid gap-2">
                                  {(concept.subTopics || []).map((topic: string, idx: number) => (
                                    <div 
                                      key={idx}
                                      className="flex items-center gap-3 p-3 rounded-lg"
                                      style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
                                    >
                                      <div 
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                                        style={{ background: accent + '20', color: accent }}
                                      >
                                        {idx + 1}
                                      </div>
                                      <span className="text-sm" style={{ color: text }}>{topic}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4" style={{ color: muted }} />
                                <span style={{ color: muted }}>Estimated time: {concept.subTopics?.length || 5} hours</span>
                              </div>
                              
                              {/* Action Button - Get AI Notes */}
                              <div className="flex items-center gap-3 pt-2">
                                <Link
                                  href={`/resources?topic=${encodeURIComponent(concept.name)}&subtopics=${encodeURIComponent(JSON.stringify(concept.subTopics || []))}`}
                                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
                                  style={{ background: accent }}
                                >
                                  <Sparkles className="w-4 h-4" />
                                  Generate AI Notes for All Topics
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Main Stacks View */
          <div className="max-w-7xl mx-auto">
          {/* Hero Section - EXACT Same as Home Page */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            {/* Badge - EXACT Same Style */}
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
              <span className="text-sm font-medium" style={{ color: accent }}>AI-Generated Learning Paths</span>
            </motion.div>
            
            {/* Main Heading - EXACT Same Style */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ color: text }}>
              Choose your <GradientText>learning path</GradientText>
            </h1>
            
            {/* Description - EXACT Same Style */}
            <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-8" style={{ color: muted }}>
              Select from comprehensive domains and technology stacks. Our AI will create personalized roadmaps tailored to your goals.
            </p>
          </motion.div>

          {/* Domain Filter */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedDomain(null)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: selectedDomain === null ? accent : subtle,
                color: selectedDomain === null ? '#fff' : muted,
                border: '1px solid ' + border
              }}
            >
              All Domains
            </button>
            {domains.map((domain) => {
              const Icon = domain.icon
              return (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: selectedDomain === domain.id ? domain.color : subtle,
                    color: selectedDomain === domain.id ? '#fff' : muted,
                    border: '1px solid ' + border
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {domain.name}
                </button>
              )
            })}
          </motion.div>

          {/* Create Own Roadmap Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-12">
            <div className="max-w-2xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                className="p-8 rounded-3xl text-center cursor-pointer transition-all"
                style={{
                  background: `linear-gradient(135deg, ${accent}20, ${accent}10)`,
                  border: `2px dashed ${accent}60`
                }}
              >
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: accent }}>
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: text }}>Create Custom Roadmap</h3>
                <p className="text-sm mb-6" style={{ color: muted }}>
                  Have a specific learning goal? Let our AI create a personalized roadmap just for you.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCustomRoadmap}
                  className="px-6 py-3 rounded-xl font-semibold text-white"
                  style={{ background: accent }}
                >
                  Create Custom Path
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stacks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allStacks
              .filter(stack => !selectedDomain || domains.find(d => d.id === selectedDomain)?.stacks.includes(stack))
              .map((stack, i) => {
                const Icon = stack.icon
                const domain = domains.find(d => d.stacks.includes(stack))
                return (
                  <motion.div
                    key={stack.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => handleStackClick(stack)}
                    className="p-6 rounded-2xl cursor-pointer transition-all group"
                    style={{
                      background: subtle,
                      border: '1px solid ' + border
                    }}
                  >
                    {/* Stack Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: domain?.color + '20' }}>
                        <Icon className="w-6 h-6" style={{ color: domain?.color }} />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-xs" style={{ color: muted }}>
                          <Star className="w-3 h-3 fill-current" style={{ color: '#F59E0B' }} />
                          {stack.popularity}%
                        </div>
                      </div>
                    </div>

                    {/* Stack Info */}
                    <h3 className="text-lg font-bold mb-2 group-hover:text-blue-500 transition-colors" style={{ color: text }}>
                      {stack.name}
                    </h3>
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: muted }}>
                      {stack.description}
                    </p>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {stack.skills.slice(0, 4).map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            background: domain?.color + '15',
                            color: domain?.color
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                      {stack.skills.length > 4 && (
                        <span className="px-2 py-1 rounded text-xs" style={{ color: muted }}>
                          +{stack.skills.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Stack Footer */}
                    <div className="flex items-center justify-between text-xs" style={{ color: muted }}>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {stack.duration}
                        </span>
                        <span>{stack.difficulty}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                )
              })}
          </div>
          </div>
        )}
        </div>
      </div>

      {/* Level Selection Modal */}
      <AnimatePresence>
        {showLevelModal && selectedStack && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowLevelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full"
              style={{ background: subtle, border: '1px solid ' + border }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: domains.find(d => d.stacks.includes(selectedStack))?.color + '20' }}>
                    <selectedStack.icon className="w-6 h-6" style={{ color: domains.find(d => d.stacks.includes(selectedStack))?.color }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: text }}>{selectedStack.name}</h2>
                    <p className="text-sm" style={{ color: muted }}>Choose your experience level</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLevelModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="text-xl" style={{ color: muted }}>×</span>
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(levelDetails).map(([level, details]) => {
                  const LevelIcon = details.icon
                  return (
                    <motion.button
                      key={level}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => generateRoadmap(level as 'beginner' | 'intermediate' | 'advanced')}
                      className="p-4 rounded-xl text-left transition-all"
                      style={{
                        background: subtle,
                        border: '1px solid ' + border
                      }}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: details.color + '20' }}>
                        <LevelIcon className="w-5 h-5" style={{ color: details.color }} />
                      </div>
                      <h3 className="font-bold mb-1" style={{ color: text }}>{details.title}</h3>
                      <p className="text-xs mb-3" style={{ color: muted }}>{details.subtitle}</p>
                      <div className="flex items-center gap-2 text-xs" style={{ color: muted }}>
                        <Clock className="w-3 h-3" />
                        <span>{selectedStack.duration}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Roadmap Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCustomModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full"
              style={{ background: subtle, border: '1px solid ' + border }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: accent + '20' }}>
                    <Target className="w-6 h-6" style={{ color: accent }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: text }}>Custom Roadmap</h2>
                    <p className="text-sm" style={{ color: muted }}>Tell us your learning goal</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="text-xl" style={{ color: muted }}>×</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: text }}>
                    What do you want to learn?
                  </label>
                  <input
                    type="text"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="e.g., Machine Learning, Mobile App Development, Data Science..."
                    className="w-full p-3 rounded-xl text-sm outline-none border-0 focus:ring-2 focus:ring-blue-500/30"
                    style={{ 
                      background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      color: text
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: text }}>
                    Your experience level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setCustomLevel(level)}
                        className="p-3 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: customLevel === level ? accent : subtle,
                          color: customLevel === level ? '#fff' : muted,
                          border: '1px solid ' + (customLevel === level ? accent : border)
                        }}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateCustomRoadmap}
                  disabled={!customGoal.trim()}
                  className="w-full p-3 rounded-xl font-semibold text-white disabled:opacity-50"
                  style={{ background: accent }}
                >
                  Generate My Roadmap
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
// Build trigger 1765727701
