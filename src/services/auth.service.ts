/**
 * Auth Service - Maneja todas las operaciones de autenticación
 */
import { apiClient } from './api'
import { type AuthUser } from '@/stores/auth-store'

export interface LoginCredentials {
  device_id: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: {
    id: string
    device_id: string
    mac_address: string
    telegram_id: number
    alias: string | null
    credits: number
    created_at: string
    updated_at: string
    role: {
      id: string
      name: string
    }
  }
}

// Re-exportar AuthUser del store para uso externo
export type { AuthUser }

class AuthService {
  /**
   * Inicia sesión de administrador
   */
  async adminLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/admin/login',
      credentials
    )
    return response.data
  }

  /**
   * Convierte la respuesta del servidor al formato del store
   */
  mapUserToAuthUser(user: LoginResponse['user']): AuthUser {
    return {
      accountNo: user.id,
      email: user.device_id,
      role: [user.role.name],
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
    }
  }
}

export const authService = new AuthService()
