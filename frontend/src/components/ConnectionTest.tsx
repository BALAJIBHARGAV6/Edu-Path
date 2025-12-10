'use client'

import { useState, useEffect } from 'react'
import { apiRequest } from '@/lib/utils'

export default function ConnectionTest() {
  const [backendStatus, setBackendStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [supabaseStatus, setSupabaseStatus] = useState<'loading' | 'connected' | 'error'>('loading')

  useEffect(() => {
    // Test backend connection
    const testBackend = async () => {
      try {
        await apiRequest('/health')
        setBackendStatus('connected')
      } catch (error) {
        console.error('Backend connection failed:', error)
        setBackendStatus('error')
      }
    }

    // Test Supabase connection
    const testSupabase = async () => {
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data, error } = await supabase.from('users').select('count').limit(1)
        if (error) throw error
        setSupabaseStatus('connected')
      } catch (error) {
        console.error('Supabase connection failed:', error)
        setSupabaseStatus('error')
      }
    }

    testBackend()
    testSupabase()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-500'
      case 'error': return 'text-red-500'
      default: return 'text-yellow-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return '✅ Connected'
      case 'error': return '❌ Error'
      default: return '🔄 Testing...'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-xl border border-gray-700 text-sm z-50">
      <h3 className="font-bold mb-2">Connection Status</h3>
      <div className="space-y-1">
        <div className={`flex items-center gap-2 ${getStatusColor(backendStatus)}`}>
          <span>Backend API:</span>
          <span>{getStatusText(backendStatus)}</span>
        </div>
        <div className={`flex items-center gap-2 ${getStatusColor(supabaseStatus)}`}>
          <span>Database:</span>
          <span>{getStatusText(supabaseStatus)}</span>
        </div>
      </div>
    </div>
  )
}
