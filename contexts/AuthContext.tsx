"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient, User } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password })
      setUser(response.data.user)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await apiClient.register({ email, password, name })
      setUser(response.data.user)
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      // Redirigir a la página de login después del logout
      router.push('/auth')
    }
  }

  const refreshAuth = async () => {
    try {
      if (apiClient.isAuthenticated()) {
        const user = await apiClient.getProfile()
        setUser(user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth refresh error:', error)
      // Limpiar tokens si falla la verificación
      apiClient.clearTokens()
      setUser(null)
      // Redirigir a login si el token es inválido
      router.push('/auth')
    }
  }

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        // Solo intentar verificar autenticación si hay un token
        if (apiClient.isAuthenticated()) {
          await refreshAuth()
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
