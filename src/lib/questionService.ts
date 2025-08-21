import { supabase, type Question } from '@/lib/supabaseClient'

// Funções para manipular perguntas
export const questionService = {
  // Obter todas as perguntas de um teste
  async getByAssessment(testId: string): Promise<Question[]> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('test_id', testId)
      .order('created_at')
    
    if (error) {
      console.error('Erro ao buscar perguntas:', error)
      throw error
    }
    
    return data || []
  },

  // Obter pergunta por ID
  async getById(id: string): Promise<Question | null> {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Erro ao buscar pergunta:', error)
      throw error
    }
    
    return data || null
  },

  // Criar nova pergunta
  async create(question: Omit<Question, 'id' | 'created_at'>): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .insert(question)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar pergunta:', error)
      throw error
    }
    
    return data
  },

  // Atualizar pergunta
  async update(id: string, updates: Partial<Question>): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao atualizar pergunta:', error)
      throw error
    }
    
    return data
  },

  // Deletar pergunta
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Erro ao deletar pergunta:', error)
      throw error
    }
  }
}