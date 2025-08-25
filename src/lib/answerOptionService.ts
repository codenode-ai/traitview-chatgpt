import { supabase, type AnswerOption } from '@/lib/supabaseClient'

// Funções para manipular opções de resposta
export const answerOptionService = {
  // Obter todas as opções de uma pergunta
  async getByQuestion(questionId: string): Promise<AnswerOption[]> {
    const { data, error } = await supabase
      .from('answer_options')
      .select('*')
      .eq('question_id', questionId)
      .order('order')
    
    if (error) {
      console.error('Erro ao buscar opções de resposta:', error)
      throw error
    }
    
    return data || []
  },

  // Obter opção de resposta por ID
  async getById(id: string): Promise<AnswerOption | null> {
    const { data, error } = await supabase
      .from('answer_options')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Erro ao buscar opção de resposta:', error)
      throw error
    }
    
    return data || null
  },

  // Criar nova opção de resposta
  async create(option: Omit<AnswerOption, 'id' | 'created_at'>): Promise<AnswerOption> {
    const { data, error } = await supabase
      .from('answer_options')
      .insert(option)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar opção de resposta:', error)
      throw error
    }
    
    return data
  },

  // Atualizar opção de resposta
  async update(id: string, updates: Partial<AnswerOption>): Promise<AnswerOption> {
    const { data, error } = await supabase
      .from('answer_options')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao atualizar opção de resposta:', error)
      throw error
    }
    
    return data
  },

  // Deletar opção de resposta
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('answer_options')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Erro ao deletar opção de resposta:', error)
      throw error
    }
  },

  // Reordenar opções de resposta
  async reorder(options: { id: string; order: number }[]): Promise<void> {
    const updates = options.map(({ id, order }) => 
      supabase
        .from('answer_options')
        .update({ order })
        .eq('id', id)
    )
    
    const results = await Promise.all(updates)
    
    // Verificar se houve algum erro
    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      console.error('Erro ao reordenar opções de resposta:', errors)
      throw errors[0].error
    }
  }
}