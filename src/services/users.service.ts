/**
 * Users Service - Gestión de usuarios
 */
import { apiClient } from './api'

export interface User {
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
    name: 'user' | 'admin'
  }
}

export interface CreateUserData {
  device_id: string
  mac_address: string
  telegram_id: number
  alias?: string
  password?: string
}

export interface UpdateUserData {
  device_id?: string
  mac_address?: string
  telegram_id?: number
  alias?: string
  password?: string
  credits?: number
  role_name?: 'user' | 'admin'
}

export interface SearchUsersParams {
  device_id?: string
  mac_address?: string
  telegram_id?: number
  alias?: string
  role_name?: string
  skip?: number
  limit?: number
}

class UsersService {
  /**
   * Obtener todos los usuarios
   */
  async getUsers(skip: number = 0, limit: number = 100): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users', {
      params: { skip, limit },
    })
    return response.data
  }

  /**
   * Buscar usuarios con filtros
   */
  async searchUsers(params: SearchUsersParams): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users/search', {
      params,
    })
    return response.data
  }

  /**
   * Obtener un usuario por ID
   */
  async getUser(userId: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${userId}`)
    return response.data
  }

  /**
   * Crear un nuevo usuario
   */
  async createUser(userData: CreateUserData): Promise<User> {
    const response = await apiClient.post<User>('/users', userData)
    return response.data
  }

  /**
   * Actualizar un usuario
   */
  async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    const response = await apiClient.put<User>(`/users/${userId}`, userData)
    return response.data
  }

  /**
   * Eliminar un usuario
   */
  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}`)
  }
}

export const usersService = new UsersService()
