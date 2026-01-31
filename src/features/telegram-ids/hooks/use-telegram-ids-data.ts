import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  telegramIDsService,
  type CreateTelegramIDData,
  type UpdateTelegramIDData,
  type SearchTelegramIDsParams,
} from '@/services/telegram-ids.service'

export function useTelegramIDsData(searchParams?: SearchTelegramIDsParams) {
  const queryClient = useQueryClient()

  const {
    data: telegramIDs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['telegram-ids', searchParams],
    queryFn: () =>
      searchParams && Object.keys(searchParams).length > 0
        ? telegramIDsService.searchTelegramIDs(searchParams)
        : telegramIDsService.getTelegramIDs(0, 1000),
  })

  const createMutation = useMutation({
    mutationFn: (telegramData: CreateTelegramIDData) =>
      telegramIDsService.createTelegramID(telegramData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-ids'] })
      toast.success('Telegram ID created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create Telegram ID')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      telegramIdUuid,
      telegramData,
    }: {
      telegramIdUuid: string
      telegramData: UpdateTelegramIDData
    }) => telegramIDsService.updateTelegramID(telegramIdUuid, telegramData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-ids'] })
      toast.success('Telegram ID updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update Telegram ID')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (telegramIdUuid: string) =>
      telegramIDsService.deleteTelegramID(telegramIdUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-ids'] })
      toast.success('Telegram ID deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete Telegram ID')
    },
  })

  return {
    telegramIDs,
    isLoading,
    error,
    createTelegramID: createMutation.mutate,
    updateTelegramID: updateMutation.mutate,
    deleteTelegramID: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
