import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Save/remove token from responses automatically
api.interceptors.response.use((response) => {
  const token = response.headers['authorization']
  if (token) {
    localStorage.setItem('token', token.replace('Bearer ', ''))
  }
  return response
})

export default api