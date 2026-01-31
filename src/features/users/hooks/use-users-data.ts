import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  usersService,
  type User,
  type CreateUserData,
  type UpdateUserData,
  type SearchUsersParams,
} from '@/services/users.service'

export function useUsersData(searchParams?: SearchUsersParams) {
  const queryClient = useQueryClient()

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users', searchParams],
    queryFn: () =>
      searchParams && Object.keys(searchParams).length > 0
        ? usersService.searchUsers(searchParams)
        : usersService.getUsers(0, 1000),
  })

  const createMutation = useMutation({
    mutationFn: (userData: CreateUserData) => usersService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create user')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: UpdateUserData }) =>
      usersService.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update user')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => usersService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete user')
    },
  })

  return {
    users,
    isLoading,
    error,
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
