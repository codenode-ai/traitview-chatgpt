import { supabase, type Test } from '@/lib/supabaseClient'

// Funções para manipular testes
export const assessmentService = {
  // Obter todos os testes de uma organização
  async getByCompany(orgId: string): Promise<Test[]> {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar testes:', error)
      throw error
    }
    
    return data || []
  },

  // Obter teste por ID
  async getById(id: string): Promise<Test | null> {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Erro ao buscar teste:', error)
      throw error
    }
    
    return data || null
  },

  // Criar novo teste
  async create(test: Omit<Test, 'id' | 'created_at'>): Promise<Test> {
    const { data, error } = await supabase
      .from('tests')
      .insert(test)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar teste:', error)
      throw error
    }
    
    return data
  },

  // Atualizar teste
  async update(id: string, updates: Partial<Test>): Promise<Test> {
    const { data, error } = await supabase
      .from('tests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao atualizar teste:', error)
      throw error
    }
    
    return data
  },

  // Deletar teste
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tests')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Erro ao deletar teste:', error)
      throw error
    }
  }
}