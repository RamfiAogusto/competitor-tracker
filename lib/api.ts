// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api'

// Tipos para autenticación
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  isActive: boolean
  emailVerified: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    tokens: AuthTokens
  }
}

// Clase para manejar la API
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, config)

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        // Si no se puede parsear el JSON, usar el mensaje por defecto
      }
      throw new Error(errorMessage)
    }

    return response.json()
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  }

  private setTokens(tokens: AuthTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
    }
  }

  private clearTokensPrivate(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
    }
  }

  // Método público para limpiar tokens
  clearTokens(): void {
    this.clearTokensPrivate()
  }

  // Métodos de autenticación
  async register(userData: {
    email: string
    password: string
    name: string
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    
    this.setTokens(response.data.tokens)
    return response
  }

  async login(credentials: {
    email: string
    password: string
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    this.setTokens(response.data.tokens)
    return response
  }

  async logout(): Promise<void> {
    try {
      await this.request('/users/logout', { method: 'POST' })
    } finally {
      this.clearTokensPrivate()
    }
  }

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = typeof window !== 'undefined' 
      ? localStorage.getItem('refreshToken') 
      : null

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await this.request<{ data: AuthTokens }>('/users/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })

    this.setTokens(response.data)
    return response.data
  }

  async getProfile(): Promise<User> {
    const response = await this.request<{ data: User }>('/users/profile')
    return response.data
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
