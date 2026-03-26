import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, check if a token exists and fetch the current user
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/api/me')
        .then(res => setCurrentUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const signup = async (email, password, password_confirmation, username) => {
    const res = await api.post('/auth/signup', {
      user: { email, password, password_confirmation, username }
    })
    setCurrentUser(res.data.user)
    return res
  }

  const login = async (email, password) => {
    const res = await api.post('/auth/login', {
      user: { email, password }
    })
    setCurrentUser(res.data.user)
    return res
  }

  const logout = async () => {
    await api.delete('/auth/logout')
    localStorage.removeItem('token')
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}