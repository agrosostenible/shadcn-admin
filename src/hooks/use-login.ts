/**
 * useLogin Hook - Maneja la lógica de autenticación
 */
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'
import { authService, type LoginCredentials } from '@/services/auth.service'

interface UseLoginOptions {
  redirectTo?: string
}

export function useLogin(options: UseLoginOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)

    try {
      // Llamar al servicio de autenticación
      const response = await authService.adminLogin(credentials)

      // Convertir usuario al formato del store
      const authUser = authService.mapUserToAuthUser(response.user)

      // Guardar en el store
      auth.setUser(authUser)
      auth.setAccessToken(response.access_token)

      // Mostrar mensaje de éxito
      const displayName = response.user.alias || response.user.device_id
      toast.success(`Welcome back, ${displayName}!`)

      // Redirigir
      const targetPath = options.redirectTo || '/'
      navigate({ to: targetPath, replace: true })

      return response
    } catch (error: unknown) {
      // Manejar errores
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.detail ||
          'Login failed. Please check your credentials.'
        toast.error(errorMessage)
      } else {
        toast.error('An unexpected error occurred. Please try again.')
      }

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    login,
    isLoading,
  }
}
