import { useQuery } from '@tanstack/react-query'
import { rolesService } from '@/services/roles.service'

export function useRoles() {
  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesService.getRoles(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  return {
    roles,
    isLoading,
  }
}
