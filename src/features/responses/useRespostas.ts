import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dataService } from '@/lib/dataService'
import type { Resposta } from '@/lib/supabaseClient'

// Hook para gerenciar respostas
export const useRespostas = () => {
  const queryClient = useQueryClient()

  // Buscar respostas por avaliação
  const useRespostasPorAvaliacao = (avaliacaoId: string) => {
    return useQuery<Resposta[]>({
      queryKey: ['respostas', avaliacaoId],
      queryFn: async () => {
        return await dataService.respostas.getByAvaliacaoId(avaliacaoId)
      }
    })
  }

  // Buscar resposta por link de acesso
  const useRespostaPorLink = (linkAcesso: string) => {
    return useQuery<Resposta | null>({
      queryKey: ['resposta', linkAcesso],
      queryFn: async () => {
        return await dataService.respostas.getByLinkAcesso(linkAcesso)
      }
    })
  }

  // Criar nova resposta
  const createRespostaMutation = useMutation({
    mutationFn: async (resposta: Omit<Resposta, 'id' | 'created_at' | 'link_acesso' | 'status' | 'iniciado_em' | 'concluido_em'>) => {
      return await dataService.respostas.create(resposta)
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
    }
  })

  // Atualizar resposta
  const updateRespostaMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Resposta> }) => {
      return await dataService.respostas.update(id, updates)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resposta', variables.id] })
    }
  })

  // Marcar resposta como iniciada
  const marcarComoIniciadaMutation = useMutation({
    mutationFn: async (id: string) => {
      return await dataService.respostas.marcarComoIniciada(id)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resposta', variables] })
    }
  })

  // Marcar resposta como concluída
  const marcarComoConcluidaMutation = useMutation({
    mutationFn: async (id: string) => {
      return await dataService.respostas.marcarComoConcluida(id)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resposta', variables] })
    }
  })

  // Salvar respostas do teste
  const salvarRespostasMutation = useMutation({
    mutationFn: async ({ id, respostas }: { id: string; respostas: { pergunta_id: number; resposta: number; pergunta_texto: string }[] }) => {
      return await dataService.respostas.salvarRespostas(id, respostas)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resposta', variables.id] })
    }
  })

  return {
    useRespostasPorAvaliacao,
    useRespostaPorLink,
    createResposta: createRespostaMutation.mutate,
    updateResposta: updateRespostaMutation.mutate,
    marcarComoIniciada: marcarComoIniciadaMutation.mutate,
    marcarComoConcluida: marcarComoConcluidaMutation.mutate,
    salvarRespostas: salvarRespostasMutation.mutate,
    isCreating: createRespostaMutation.isPending,
    isUpdating: updateRespostaMutation.isPending,
    isIniciando: marcarComoIniciadaMutation.isPending,
    isConcluindo: marcarComoConcluidaMutation.isPending,
    isSalvando: salvarRespostasMutation.isPending
  }
}