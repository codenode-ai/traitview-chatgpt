import { supabase } from '@/lib/supabaseClient'
import type { Resposta, Teste } from '@/lib/supabaseClient'

// Função RPC para validar token e resolver dados do teste
export const validarTokenEObterDados = async (token: string) => {
  try {
    // Buscar resposta pelo link de acesso
    const { data: resposta, error: respostaError } = await supabase
      .from('respostas')
      .select(`
        *,
        colaboradores(nome, email),
        testes(*)
      `)
      .eq('link_acesso', token)
      .single()

    if (respostaError) {
      console.error('Erro ao buscar resposta por token:', respostaError)
      throw new Error('Token inválido ou expirado')
    }

    if (!resposta) {
      throw new Error('Token não encontrado')
    }

    // Verificar se o link expirou (exemplo: 7 dias de validade)
    const dataCriacao = new Date(resposta.created_at)
    const dataExpiracao = new Date(dataCriacao.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 dias
    const agora = new Date()

    if (agora > dataExpiracao) {
      throw new Error('Link expirado')
    }

    // Verificar se a resposta já foi concluída
    if (resposta.status === 'concluida') {
      throw new Error('Este questionário já foi respondido')
    }

    // Retornar os dados necessários para a interface do colaborador
    return {
      resposta: {
        id: resposta.id,
        avaliacao_id: resposta.avaliacao_id,
        colaborador: {
          nome: resposta.colaboradores?.nome || '',
          email: resposta.colaboradores?.email || ''
        },
        teste: resposta.testes,
        status: resposta.status,
        iniciado_em: resposta.iniciado_em
      }
    }
  } catch (error) {
    console.error('Erro na validação do token:', error)
    throw error
  }
}

// Função RPC para salvar respostas validando token
export const salvarRespostasComToken = async (
  token: string,
  respostas: { pergunta_id: number; resposta: number; pergunta_texto: string }[]
) => {
  try {
    // Primeiro, validar o token
    const { resposta } = await validarTokenEObterDados(token)
    
    // Marcar resposta como iniciada (se ainda não estiver)
    if (resposta.status === 'pendente') {
      await supabase
        .from('respostas')
        .update({ 
          status: 'iniciada',
          iniciado_em: new Date().toISOString()
        })
        .eq('id', resposta.id)
    }

    // Salvar as respostas
    const { data, error } = await supabase
      .from('respostas')
      .update({
        respostas: respostas,
        status: 'concluida',
        concluido_em: new Date().toISOString()
      })
      .eq('id', resposta.id)
      .select()

    if (error) {
      console.error('Erro ao salvar respostas:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erro ao salvar respostas com token:', error)
    throw error
  }
}