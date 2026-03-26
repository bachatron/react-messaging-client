import { useState, useEffect } from 'react'
import api from '../services/api'

export default function useConversations() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/conversations')
      .then(res => setConversations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const startConversation = async (userId) => {
    const res = await api.post('/api/conversations', { user_id: userId })
    setConversations(prev => {
      const exists = prev.find(c => c.id === res.data.id)
      return exists ? prev : [res.data, ...prev]
    })
    return res.data
  }

  return { conversations, setConversations, loading, startConversation }
} 