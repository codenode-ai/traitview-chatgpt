import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dataService } from '@/lib/dataService'
import type { Avaliacao } from '@/lib/supabaseClient'

// Hook para gerenciar avaliações
export const useAvaliacoes = () => {
  const queryClient = useQueryClient()

  // Buscar todas as avaliações
  const { data: avaliacoes, isLoading, error } = useQuery<Avaliacao[]>({
    queryKey: ['avaliacoes'],
    queryFn: async () => {
      return await dataService.avaliacoes.getAll()
    }
  })

  // Criar nova avaliação
  const createAvaliacaoMutation = useMutation({
    mutationFn: async (avaliacao: Omit<Avaliacao, 'id' | 'created_at' | 'status'>) => {
      return await dataService.avaliacoes.create(avaliacao)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] })
    }
  })

  // Atualizar avaliação
  const updateAvaliacaoMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Avaliacao> }) => {
      return await dataService.avaliacoes.update(id, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] })
    }
  })

  // Deletar avaliação
  const deleteAvaliacaoMutation = useMutation({
    mutationFn: async (id: string) => {
      return await dataService.avaliacoes.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] })
    }
  })

  // Marcar avaliação como enviada
  const marcarComoEnviadaMutation = useMutation({
    mutationFn: async (id: string) => {
      return await dataService.avaliacoes.marcarComoEnviada(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] })
    }
  })

  // Marcar avaliação como concluída
  const marcarComoConcluidaMutation = useMutation({
    mutationFn: async (id: string) => {
      return await dataService.avaliacoes.marcarComoConcluida(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] })
    }
  })

  return {
    avaliacoes,
    isLoading,
    error,
    createAvaliacao: createAvaliacaoMutation.mutate,
    updateAvaliacao: updateAvaliacaoMutation.mutate,
    deleteAvaliacao: deleteAvaliacaoMutation.mutate,
    marcarComoEnviada: marcarComoEnviadaMutation.mutate,
    marcarComoConcluida: marcarComoConcluidaMutation.mutate,
    isCreating: createAvaliacaoMutation.isPending,
    isUpdating: updateAvaliacaoMutation.isPending,
    isDeleting: deleteAvaliacaoMutation.isPending,
    isEnviando: marcarComoEnviadaMutation.isPending,
    isConcluindo: marcarComoConcluidaMutation.isPending
  }
}