import { supabase, type Avaliacao } from '@/lib/supabaseClient'

// Funções para manipular avaliações
export const avaliacaoService = {
  // Obter todas as avaliações
  async getAll(): Promise<Avaliacao[]> {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar avaliações:', error)
      throw error
    }
    
    return data || []
  },

  // Obter avaliação por ID
  async getById(id: string): Promise<Avaliacao | null> {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Erro ao buscar avaliação:', error)
      throw error
    }
    
    return data || null
  },

  // Criar nova avaliação
  async create(avaliacao: Omit<Avaliacao, 'id' | 'created_at' | 'status'>): Promise<Avaliacao> {
    const { data, error } = await supabase
      .from('avaliacoes')
      .insert({
        ...avaliacao,
        status: 'rascunho',
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar avaliação:', error)
      throw error
    }
    
    return data
  },

  // Atualizar avaliação
  async update(id: string, updates: Partial<Omit<Avaliacao, 'id' | 'created_at'>>): Promise<Avaliacao> {
    const { data, error } = await supabase
      .from('avaliacoes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao atualizar avaliação:', error)
      throw error
    }
    
    return data
  },

  // Deletar avaliação
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('avaliacoes')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Erro ao deletar avaliação:', error)
      throw error
    }
  },

  // Marcar avaliação como enviada
  async marcarComoEnviada(id: string): Promise<Avaliacao> {
    return await this.update(id, { status: 'enviada' })
  },

  // Marcar avaliação como concluída
  async marcarComoConcluida(id: string): Promise<Avaliacao> {
    return await this.update(id, { status: 'concluida' })
  }
}