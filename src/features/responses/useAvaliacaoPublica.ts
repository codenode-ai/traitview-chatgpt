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
      
      try {
        console.log('Validando token:', token)
        const data = await dataService.respostas.validarTokenEObterDados(token)
        console.log('Dados recebidos:', data)
        
        if (!data) {
          throw new Error("Link inválido ou expirado")
        }
        
        // Se a resposta ainda não foi iniciada, marcar como iniciada
        if (data.status_resposta === 'pendente') {
          console.log('Marcando resposta como iniciada')
          await dataService.respostas.marcarRespostaIniciada(token)
        }
        
        return data
      } catch (error: any) {
        console.error('Erro ao validar token:', error)
        if (error.message?.includes('configuração')) {
          throw new Error('Problema de configuração no servidor. Por favor, tente novamente mais tarde.')
        }
        throw new Error(error.message || "Erro ao validar o link de acesso")
      }
    },
    enabled: !!token,
    retry: 1 // Tentar apenas uma vez novamente em caso de erro
  })

  // Mutation para salvar respostas
  const salvarRespostasMutation = useMutation({
    mutationFn: async (respostas: { pergunta_id: number; resposta: number; pergunta_texto: string }[]) => {
      if (!token) {
        throw new Error("Token não fornecido")
      }
      
      try {
        console.log('Salvando respostas com token:', token)
        // Salvar respostas validando o token
        const result = await dataService.respostas.salvarRespostasComToken(token, respostas)
        console.log('Respostas salvas:', result)
        
        return result
      } catch (error: any) {
        console.error('Erro ao salvar respostas:', error)
        if (error.message?.includes('inválido')) {
          throw new Error('Link expirado ou inválido. Por favor, solicite um novo link.')
        }
        throw new Error(error.message || "Erro ao salvar respostas")
      }
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