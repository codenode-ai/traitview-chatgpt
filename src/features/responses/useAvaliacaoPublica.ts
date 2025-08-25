import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dataService } from '@/lib/dataService'

// Hook para gerenciar a avaliação pública
export const useAvaliacaoPublica = (token: string | undefined) => {
  const queryClient = useQueryClient()

  // Validar token e obter dados da resposta
  const { 
    data: respostaData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['resposta', token],
    queryFn: async () => {
      if (!token) {
        throw new Error("Token não fornecido")
      }
      
      const data = await dataService.respostas.validarTokenEObterDados(token)
      
      if (!data) {
        throw new Error("Link inválido ou expirado")
      }
      
      // Se a resposta ainda não foi iniciada, marcar como iniciada
      if (data.status_resposta === 'pendente') {
        await dataService.respostas.marcarRespostaIniciada(token)
      }
      
      return data
    },
    enabled: !!token,
    retry: false
  })

  // Mutation para salvar respostas
  const salvarRespostasMutation = useMutation({
    mutationFn: async (respostas: { pergunta_id: number; resposta: number; pergunta_texto: string }[]) => {
      if (!token) {
        throw new Error("Token não fornecido")
      }
      
      // Salvar respostas validando o token
      await dataService.respostas.salvarRespostasComToken(token, respostas)
      
      return true
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resposta', token] })
    }
  })

  return {
    respostaData,
    isLoading,
    error: error ? (error as Error).message : null,
    salvarRespostas: salvarRespostasMutation.mutate,
    isSalvando: salvarRespostasMutation.isPending,
    isSuccess: salvarRespostasMutation.isSuccess
  }
}