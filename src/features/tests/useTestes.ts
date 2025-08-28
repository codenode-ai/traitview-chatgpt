import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dataService } from '@/lib/dataService'
import type { Teste } from '@/lib/supabaseClient'

// Hook para gerenciar testes
export const useTestes = () => {
  const queryClient = useQueryClient()

  // Buscar todos os testes
  const { data: testes, isLoading, error } = useQuery<Teste[]>({
    queryKey: ['testes'],
    queryFn: async () => {
      return await dataService.testes.getAll()
    }
  })

  // Criar novo teste
  const createTesteMutation = useMutation({
    mutationFn: async (teste: Omit<Teste, 'id' | 'created_at' | 'updated_at' | 'versao' | 'ativo'>) => {
      return await dataService.testes.create(teste)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testes'] })
    }
  })

  // Atualizar teste
  const updateTesteMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Teste> }) => {
      return await dataService.testes.update(id, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testes'] })
    }
  })

  // Deletar teste
  const deleteTesteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await dataService.testes.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testes'] })
    }
  })

  // Duplicar teste
  const duplicateTesteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await dataService.testes.duplicate(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testes'] })
    }
  })

  return {
    testes,
    isLoading,
    error,
    createTeste: createTesteMutation.mutate,
    updateTeste: updateTesteMutation.mutate,
    deleteTeste: deleteTesteMutation.mutate,
    duplicateTeste: duplicateTesteMutation.mutate,
    isCreating: createTesteMutation.isPending,
    isUpdating: updateTesteMutation.isPending,
    isDeleting: deleteTesteMutation.isPending,
    isDuplicating: duplicateTesteMutation.isPending
  }
}