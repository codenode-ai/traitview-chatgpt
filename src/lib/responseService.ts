import { supabase, type Evaluation, type Answer } from '@/lib/supabaseClient'

// Funções para manipular avaliações e respostas
export const responseService = {
  // Criar nova avaliação (início de um questionário)
  async create(evaluation: Omit<Evaluation, 'id' | 'created_at' | 'status'>): Promise<Evaluation> {
    const { data, error } = await supabase
      .from('evaluations')
      .insert({
        ...evaluation,
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar avaliação:', error)
      throw error
    }
    
    return data
  },

  // Obter avaliação por ID
  async getById(id: string): Promise<Evaluation | null> {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Erro ao buscar avaliação:', error)
      throw error
    }
    
    return data || null
  },

  // Adicionar resposta a uma pergunta
  async addAnswer(answer: Omit<Answer, 'id' | 'created_at'>): Promise<Answer> {
    const { data, error } = await supabase
      .from('answers')
      .insert(answer)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao adicionar resposta à pergunta:', error)
      throw error
    }
    
    return data
  },

  // Obter todas as respostas de uma avaliação
  async getAnswers(evaluationId: string): Promise<Answer[]> {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('evaluation_id', evaluationId)
    
    if (error) {
      console.error('Erro ao buscar respostas da avaliação:', error)
      throw error
    }
    
    return data || []
  },

  // Verificar se uma resposta já foi dada para uma pergunta
  async getAnswerForQuestion(evaluationId: string, questionId: string): Promise<Answer | null> {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('evaluation_id', evaluationId)
      .eq('question_id', questionId)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 é o código para "nenhum registro encontrado"
      console.error('Erro ao buscar resposta para pergunta:', error)
      throw error
    }
    
    return data || null
  },

  // Atualizar status da avaliação para concluída
  async completeEvaluation(evaluationId: string): Promise<Evaluation> {
    const { data, error } = await supabase
      .from('evaluations')
      .update({ status: 'completed' })
      .eq('id', evaluationId)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao completar avaliação:', error)
      throw error
    }
    
    return data
  }
}