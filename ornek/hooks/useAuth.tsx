'use client'

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react'

interface User {
  id: string
  userId: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userId: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan token kontrolü
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Mock user data - gerçek uygulamada API'den alınır
      const mockUser: User = {
        id: '1',
        userId: 'ab196607',
        name: 'Admin User',
        role: 'admin',
      }
      setUser(mockUser)
    }
    setLoading(false)
  }, [])

  const login = async (userId: string, password: string): Promise<boolean> => {
    try {
      // Mock login - gerçek uygulamada API'ye istek atılır
      if (userId === '196607' && password === '123456') {
        const mockUser: User = {
          id: '1',
          userId: `ab${userId}`,
          name: 'Admin User',
          role: 'admin',
        }

        // Token oluştur ve localStorage'a kaydet
        const token = `mock_token_${Date.now()}`
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_data', JSON.stringify(mockUser))

        setUser(mockUser)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
