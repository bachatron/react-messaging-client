import { useState, useEffect } from 'react'
import api from '../services/api'

export default function useMessages(conversationId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!conversationId) return
    setLoading(true)
    api.get(`/api/conversations/${conversationId}/messages`)
      .then(res => setMessages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [conversationId])

  const sendMessage = async (body, image = null) => {
    const formData = new FormData()
    if (body) formData.append('body', body)
    if (image) formData.append('image', image)

    const res = await api.post(
      `/api/conversations/${conversationId}/messages`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    setMessages(prev => [...prev, res.data])
    return res.data
  }

  return { messages, loading, sendMessage }
}