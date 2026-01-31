import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  gatesService,
  type Gate,
  type CreateGateData,
  type UpdateGateData,
  type SearchGatesParams,
} from '@/services/gates.service'

export function useGatesData(searchParams?: SearchGatesParams) {
  const queryClient = useQueryClient()

  const {
    data: gates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['gates', searchParams],
    queryFn: () =>
      searchParams && Object.keys(searchParams).length > 0
        ? gatesService.searchGates(searchParams)
        : gatesService.getGates(0, 1000),
  })

  const createMutation = useMutation({
    mutationFn: (gateData: CreateGateData) =>
      gatesService.createGate(gateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gates'] })
      toast.success('Gate created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create gate')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      gateId,
      gateData,
    }: {
      gateId: string
      gateData: UpdateGateData
    }) => gatesService.updateGate(gateId, gateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gates'] })
      toast.success('Gate updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update gate')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (gateId: string) => gatesService.deleteGate(gateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gates'] })
      toast.success('Gate deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete gate')
    },
  })

  return {
    gates,
    isLoading,
    error,
    createGate: createMutation.mutate,
    updateGate: updateMutation.mutate,
    deleteGate: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
