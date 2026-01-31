/**
 * Roles Service - Gestión de Roles
 */
import { apiClient } from './api'

export interface Role {
  id: string
  name: string
}

class RolesService {
  /**
   * Obtener todos los roles
   */
  async getRoles(): Promise<Role[]> {
    // Asumiendo que existe un endpoint para listar roles
    // Si no existe, podríamos obtenerlos de otro endpoint
    try {
      const response = await apiClient.get<Role[]>('/roles')
      return response.data
    } catch (error) {
      // Si no existe el endpoint, retornar roles predefinidos
      return [
        { id: 'user', name: 'user' },
        { id: 'admin', name: 'admin' },
      ]
    }
  }
}

export const rolesService = new RolesService()
