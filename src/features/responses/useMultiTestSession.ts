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
        
        // Validar token e obter dados da resposta usando a função RPC
        const { data: respostaData, error: respostaError } = await supabase
          .rpc('validar_token_resposta', { token })
        
        if (respostaError) {
          console.error('Erro ao validar token:', respostaError)
          throw new Error("Link inválido ou expirado")
        }
        
        if (!respostaData || respostaData.length === 0) {
          throw new Error("Link inválido ou expirado")
        }
        
        const resposta = respostaData[0]
        
        // Se a resposta estiver expirada
        if (resposta.expirado) {
          throw new Error("Link expirado")
        }
        
        // Buscar todas as respostas da mesma avaliação
        const { data: todasRespostas, error: todasRespostasError } = await supabase
          .from('respostas')
          .select(`
            id,
            teste_id,
            status,
            link_acesso,
            testes!fk_respostas_teste_id(
              id,
              nome,
              descricao,
              perguntas
            )
          `)
          .eq('avaliacao_id', resposta.avaliacao_id)
        
        if (todasRespostasError) {
          console.error('Erro ao buscar todas as respostas:', todasRespostasError)
          throw new Error("Erro ao buscar dados da sessão")
        }
        
        // Marcar a resposta como iniciada se ainda não estiver
        if (resposta.status_resposta === 'pendente') {
          console.log('Marcando resposta como iniciada')
          await supabase
            .rpc('marcar_resposta_iniciada', { token })
        }
        
        // Criar estrutura de testes para a sessão
        const testesParaSessao = todasRespostas.map((r: any) => ({
          resposta_id: r.id,
          teste_id: r.teste_id,
          teste_nome: r.testes?.nome || "Teste",
          teste_descricao: r.testes?.descricao || "",
          teste_perguntas: r.testes?.perguntas || [],
          status_resposta: r.status,
          link_acesso: r.link_acesso
        }))
        
        return {
          avaliacao_id: resposta.avaliacao_id,
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
        console.log('Salvando respostas para resposta:', respostaId)
        
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