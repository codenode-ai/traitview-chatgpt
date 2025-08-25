import { supabase, type Resposta } from '@/lib/supabaseClient'
import { uid } from '@/lib/utils'

// Funções para manipular respostas
export const respostaService = {
  // Obter todas as respostas
  async getAll(): Promise<Resposta[]> {
    const { data, error } = await supabase
      .from('respostas')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar respostas:', error)
      throw error
    }
    
    return data || []
  },

  // Obter respostas por avaliação
  async getByAvaliacaoId(avaliacaoId: string): Promise<Resposta[]> {
    const { data, error } = await supabase
      .from('respostas')
      .select(`
        *,
        colaboradores(nome, email),
        testes(*)
      `)
      .eq('avaliacao_id', avaliacaoId)
    
    if (error) {
      console.error('Erro ao buscar respostas da avaliação:', error)
      throw error
    }
    
    return data || []
  },

  // Obter resposta por ID
  async getById(id: string): Promise<Resposta | null> {
    const { data, error } = await supabase
      .from('respostas')
      .select(`
        *,
        colaboradores(nome, email),
        testes(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Erro ao buscar resposta:', error)
      throw error
    }
    
    return data || null
  },

  // Obter resposta por link de acesso
  async getByLinkAcesso(linkAcesso: string): Promise<Resposta | null> {
    const { data, error } = await supabase
      .from('respostas')
      .select(`
        *,
        colaboradores(nome, email),
        testes(*)
      `)
      .eq('link_acesso', linkAcesso)
      .single()
    
    if (error) {
      console.error('Erro ao buscar resposta por link:', error)
      throw error
    }
    
    return data || null
  },

  // Criar nova resposta (gera link de acesso automaticamente)
  async create(resposta: Omit<Resposta, 'id' | 'created_at' | 'link_acesso' | 'status' | 'iniciado_em' | 'concluido_em'>): Promise<Resposta> {
    // Gerar token único para o link de acesso
    const linkAcesso = uid('link_')
    
    const { data, error } = await supabase
      .from('respostas')
      .insert({
        ...resposta,
        link_acesso: linkAcesso,
        status: 'pendente',
        iniciado_em: null,
        concluido_em: null,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar resposta:', error)
      throw error
    }
    
    return data
  },

  // Atualizar resposta
  async update(id: string, updates: Partial<Omit<Resposta, 'id' | 'created_at' | 'link_acesso'>>): Promise<Resposta> {
    const { data, error } = await supabase
      .from('respostas')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao atualizar resposta:', error)
      throw error
    }
    
    return data
  },

  // Deletar resposta
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('respostas')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Erro ao deletar resposta:', error)
      throw error
    }
  },

  // Marcar resposta como iniciada
  async marcarComoIniciada(id: string): Promise<Resposta> {
    return await this.update(id, { 
      status: 'iniciada',
      iniciado_em: new Date().toISOString()
    })
  },

  // Marcar resposta como concluída
  async marcarComoConcluida(id: string): Promise<Resposta> {
    return await this.update(id, { 
      status: 'concluida',
      concluido_em: new Date().toISOString()
    })
  },

  // Salvar respostas individuais
  async salvarRespostas(
    id: string, 
    respostas: { pergunta_id: number; resposta: number; pergunta_texto: string }[]
  ): Promise<Resposta> {
    return await this.update(id, { respostas })
  },

  // Salvar resultado da avaliação
  async salvarResultado(
    id: string, 
    resultado: { score: number; faixa: string; interpretacao: string }
  ): Promise<Resposta> {
    return await this.update(id, { resultado })
  },

  // ====================
  // FUNÇÕES RPC
  // ====================

  // Validar token e obter dados da resposta
  async validarTokenEObterDados(token: string): Promise<any> {
    const { data, error } = await supabase
      .rpc('validar_token_resposta', { token })
    
    if (error) {
      console.error('Erro ao validar token:', error)
      throw error
    }
    
    return data
  },

  // Salvar respostas validando token
  async salvarRespostasComToken(
    token: string, 
    respostas: { pergunta_id: number; resposta: number; pergunta_texto: string }[]
  ): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('salvar_respostas_com_token', { 
        token, 
        respostas_json: JSON.stringify(respostas) 
      })
    
    if (error) {
      console.error('Erro ao salvar respostas com token:', error)
      throw error
    }
    
    return data
  },

  // Marcar resposta como iniciada via token
  async marcarRespostaIniciada(token: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('marcar_resposta_iniciada', { token })
    
    if (error) {
      console.error('Erro ao marcar resposta como iniciada:', error)
      throw error
    }
    
    return data
  }
}