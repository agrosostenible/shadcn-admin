import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  liveRecordsService,
  type CreateLiveRecordData,
  type UpdateLiveRecordData,
  type SearchLiveRecordsParams,
} from '@/services/live-records.service'

export function useLiveRecordsData(searchParams?: SearchLiveRecordsParams) {
  const queryClient = useQueryClient()

  const {
    data: liveRecords = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['live-records', searchParams],
    queryFn: () =>
      searchParams && Object.keys(searchParams).length > 0
        ? liveRecordsService.searchLiveRecords(searchParams)
        : liveRecordsService.getLiveRecords(0, 1000),
  })

  const createMutation = useMutation({
    mutationFn: (liveRecordData: CreateLiveRecordData) =>
      liveRecordsService.createLiveRecord(liveRecordData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-records'] })
      toast.success('Live record created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create live record')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      liveRecordId,
      liveRecordData,
    }: {
      liveRecordId: string
      liveRecordData: UpdateLiveRecordData
    }) => liveRecordsService.updateLiveRecord(liveRecordId, liveRecordData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-records'] })
      toast.success('Live record updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update live record')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (liveRecordId: string) => liveRecordsService.deleteLiveRecord(liveRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-records'] })
      toast.success('Live record deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete live record')
    },
  })

  return {
    liveRecords,
    isLoading,
    error,
    createLiveRecord: createMutation.mutate,
    updateLiveRecord: updateMutation.mutate,
    deleteLiveRecord: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
