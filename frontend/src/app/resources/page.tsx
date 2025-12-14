'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, Sparkles, Bot, User, Loader2, Copy, Check, 
  Trash2, MessageSquare, BookOpen, Lightbulb, Code2,
  RefreshCw, ArrowDown
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { useStore } from '@/lib/store'
import PageWrapper from '@/components/PageWrapper'
import GradientText from '@/components/GradientText'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  { icon: Code2, text: "Explain async/await in JavaScript", category: "Programming" },
  { icon: BookOpen, text: "What are React hooks and how do they work?", category: "React" },
  { icon: Lightbulb, text: "Best practices for API design", category: "Backend" },
  { icon: MessageSquare, text: "How to optimize database queries?", category: "Database" },
]

export default function ResourcesPage() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { currentRoadmap } = useStore()
  const isDark = theme === 'dark'
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const bg = isDark ? '#09090B' : '#FFFFFF'
  const text = isDark ? '#FAFAFA' : '#09090B'
  const muted = isDark ? '#A1A1AA' : '#71717A'
  const subtle = isDark ? '#18181B' : '#F4F4F5'
  const border = isDark ? '#27272A' : '#E4E4E7'
  const accent = '#3B82F6'

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle scroll visibility for scroll button
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
    }
  }

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'
  }

  const copyToClipboard = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success('Copied to clipboard!')
  }

  const clearChat = () => {
    setMessages([])
    toast.success('Chat cleared!')
  }

  const sendMessage = async (content: string = input.trim()) => {
    if (!content || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/resources/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content,
          context: currentRoadmap?.skill?.name || 'general programming'
        })
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "I'm sorry, I couldn't process that request. Please try again.",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      toast.error('Failed to get response')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <PageWrapper>
      <div className="min-h-screen pt-16 sm:pt-20" style={{ background: isDark ? '#0A0A0F' : '#F8FFFE' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)] flex flex-col">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: text }}>
                AI <GradientText>Learning Assistant</GradientText>
              </h1>
            </div>
            <p className="text-sm" style={{ color: muted }}>
              Ask any programming question and get instant, detailed answers
            </p>
          </motion.div>

          {/* Chat Container */}
          <div 
            ref={chatContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto rounded-2xl mb-4 relative"
            style={{ 
              background: subtle,
              border: `1px solid ${border}`
            }}
          >
            {messages.length === 0 ? (
              /* Welcome State */
              <div className="h-full flex flex-col items-center justify-center p-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center max-w-lg"
                >
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-xl font-bold mb-2" style={{ color: text }}>
                    How can I help you today?
                  </h2>
                  <p className="text-sm mb-8" style={{ color: muted }}>
                    I can explain concepts, debug code, suggest best practices, and help you learn faster.
                  </p>

                  {/* Suggested Questions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestedQuestions.map((q, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        onClick={() => sendMessage(q.text)}
                        className="flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:scale-[1.02] group"
                        style={{ 
                          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          border: `1px solid ${border}`
                        }}
                      >
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                          style={{ background: `${accent}20` }}
                        >
                          <q.icon className="w-5 h-5" style={{ color: accent }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: text }}>{q.text}</p>
                          <p className="text-xs" style={{ color: muted }}>{q.category}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              /* Messages */
              <div className="p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message, i) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div 
                        className={`max-w-[80%] rounded-2xl px-4 py-3 relative group ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                            : ''
                        }`}
                        style={message.role === 'assistant' ? { 
                          background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                          border: `1px solid ${border}`
                        } : {}}
                      >
                        <div 
                          className="text-sm leading-relaxed whitespace-pre-wrap"
                          style={{ color: message.role === 'user' ? '#fff' : text }}
                        >
                          {message.content}
                        </div>
                        
                        {message.role === 'assistant' && (
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ borderColor: border }}
                          >
                            <button
                              onClick={() => copyToClipboard(message.id, message.content)}
                              className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                            >
                              {copiedId === message.id ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" style={{ color: muted }} />
                              )}
                            </button>
                            <button
                              onClick={() => sendMessage(`Explain more about: ${message.content.slice(0, 50)}...`)}
                              className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                            >
                              <RefreshCw className="w-4 h-4" style={{ color: muted }} />
                            </button>
                          </div>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md"
                          style={{ background: accent }}
                        >
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div 
                      className="rounded-2xl px-4 py-3"
                      style={{ 
                        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${border}`
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full"
                              style={{ background: accent }}
                              animate={{ y: [0, -6, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            />
                          ))}
                        </div>
                        <span className="text-sm" style={{ color: muted }}>Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Scroll to bottom button */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={scrollToBottom}
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full shadow-lg flex items-center justify-center"
                  style={{ background: accent }}
                >
                  <ArrowDown className="w-5 h-5 text-white" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-3 flex items-end gap-3"
            style={{ 
              background: subtle,
              border: `1px solid ${border}`
            }}
          >
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="p-3 rounded-xl hover:bg-red-500/10 transition-colors flex-shrink-0"
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            )}
            
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about programming, concepts, debugging..."
              rows={1}
              className="flex-1 resize-none outline-none text-sm py-3 px-4 rounded-xl"
              style={{ 
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                color: text,
                maxHeight: '150px'
              }}
            />
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: input.trim() && !isLoading 
                  ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' 
                  : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
              }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </motion.button>
          </motion.div>

          {/* Footer hint */}
          <p className="text-center text-xs mt-3" style={{ color: muted }}>
            Press <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: border }}>Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: border }}>Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>
    </PageWrapper>
  )
}
