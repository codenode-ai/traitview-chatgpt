import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

// Hook para gerenciar uma sessão com múltiplos testes
export const useMultiTestSession = (token: string | undefined) => {
  const queryClient = useQueryClient()

  // Obter todos os testes associados ao token
  const { 
    data: sessionData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['multi-test-session', token],
    queryFn: async () => {
      if (!token) {
        throw new Error("Token não fornecido")
      }
      
      try {
        console.log('Buscando sessão para token:', token)
        
        // Buscar a resposta pelo token
        const { data: resposta, error: respostaError } = await supabase
          .from('respostas')
          .select(`
            id,
            avaliacao_id,
            status,
            link_acesso,
            avaliacoes(
              id,
              testes_ids
            )
          `)
          .eq('link_acesso', token)
          .single()
        
        if (respostaError) {
          console.error('Erro ao buscar resposta:', respostaError)
          throw new Error("Link inválido ou expirado")
        }
        
        if (!resposta) {
          throw new Error("Sessão não encontrada")
        }
        
        const avaliacaoId = resposta.avaliacao_id
        const testesIds = resposta.avaliacoes?.testes_ids || []
        
        // Buscar a avaliação completa para obter os testes
        const { data: avaliacao, error: avaliacaoError } = await supabase
          .from('avaliacoes')
          .select(`
            id,
            testes_ids,
            testes(
              id,
              nome,
              descricao,
              perguntas
            )
          `)
          .eq('id', avaliacaoId)
          .single()
        
        if (avaliacaoError) {
          console.error('Erro ao buscar avaliação:', avaliacaoError)
          throw new Error("Erro ao buscar dados da avaliação")
        }
        
        // Marcar a resposta como iniciada se ainda não estiver
        if (resposta.status === 'pendente') {
          console.log('Marcando resposta como iniciada')
          await supabase
            .from('respostas')
            .update({ 
              status: 'iniciada',
              iniciado_em: new Date().toISOString()
            })
            .eq('id', resposta.id)
        }
        
        // Criar estrutura de testes para a sessão
        const testesParaSessao = (avaliacao.testes || []).map((teste: any) => ({
          resposta_id: resposta.id,
          teste_id: teste.id,
          teste_nome: teste.nome,
          teste_descricao: teste.descricao,
          teste_perguntas: teste.perguntas || [],
          status_resposta: resposta.status === 'concluida' ? 'concluida' : 'pendente',
          link_acesso: resposta.link_acesso
        }))
        
        return {
          avaliacao_id: avaliacaoId,
          testes: testesParaSessao
        }
      } catch (error: any) {
        console.error('Erro ao buscar sessão:', error)
        throw new Error(error.message || "Erro ao buscar dados da sessão")
      }
    },
    enabled: !!token,
    retry: 1
  })

  // Mutation para salvar respostas de um teste específico
  const salvarRespostasMutation = useMutation({
    mutationFn: async ({ respostaId, respostas }: { 
      respostaId: string, 
      respostas: { pergunta_id: number; resposta: number; pergunta_texto: string }[] 
    }) => {
      if (!respostaId || !respostas) {
        throw new Error("Dados insuficientes para salvar respostas")
      }
      
      try {
        console.log('Salvando respostas para resposta:', respostaId, respostas)
        
        // Atualizar a resposta
        const { data, error } = await supabase
          .from('respostas')
          .update({
            respostas: respostas,
            status: 'concluida',
            concluido_em: new Date().toISOString()
          })
          .eq('id', respostaId)
          .select()
        
        if (error) {
          console.error('Erro ao salvar respostas:', error)
          throw new Error("Erro ao salvar respostas: " + error.message)
        }
        
        return data
      } catch (error: any) {
        console.error('Erro ao salvar respostas:', error)
        throw new Error(error.message || "Erro ao salvar respostas")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multi-test-session', token] })
    }
  })

  return {
    sessionData,
    isLoading,
    error: error ? (error as Error).message : null,
    salvarRespostas: salvarRespostasMutation.mutate,
    isSalvando: salvarRespostasMutation.isPending,
    isSuccess: salvarRespostasMutation.isSuccess
  }
}