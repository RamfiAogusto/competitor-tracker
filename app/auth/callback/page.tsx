"use client"

import { useEffect, Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setUser, refreshAuth } = useAuth()
  const [hasProcessed, setHasProcessed] = useState(false)

  useEffect(() => {
    if (hasProcessed) return // Evitar procesamiento múltiple

    const token = searchParams.get('token')
    const success = searchParams.get('success')
    const error = searchParams.get('error')

    console.log('Callback params:', { token, success, error })

    if (error) {
      console.error('Error en autenticación con Google:', error)
      router.push('/auth?error=google_auth_failed')
      return
    }

    if (success === 'true' && token) {
      setHasProcessed(true) // Marcar como procesado
      
      // Limpiar localStorage anterior
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken')
        localStorage.setItem('authToken', token)
      }
      
      // Refrescar la autenticación para obtener los datos del usuario
      refreshAuth().then(() => {
        console.log('Auth refreshed, redirecting to dashboard')
        router.push('/dashboard')
      }).catch((err) => {
        console.error('Error refreshing auth:', err)
        router.push('/auth')
      })
    } else {
      console.log('No token or success, redirecting to auth')
      router.push('/auth')
    }
  }, [searchParams, router, setUser, refreshAuth, hasProcessed])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Eye className="h-8 w-8 animate-pulse mx-auto mb-4" />
        <p>Procesando autenticación...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Eye className="h-8 w-8 animate-pulse mx-auto mb-4" />
          <p>Cargando...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
