import { supabase, type Colaborador } from '@/lib/supabaseClient'

// Funções para manipular colaboradores
export const colaboradorService = {
  // Obter todos os colaboradores
  async getAll(): Promise<Colaborador[]> {
    const { data, error } = await supabase
      .from('colaboradores')
      .select('*')
      .order('nome')
    
    if (error) {
      console.error('Erro ao buscar colaboradores:', error)
      throw error
    }
    
    return data || []
  },

  // Obter colaborador por ID
  async getById(id: string): Promise<Colaborador | null> {
    const { data, error } = await supabase
      .from('colaboradores')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Erro ao buscar colaborador:', error)
      throw error
    }
    
    return data || null
  },

  // Obter colaborador por email
  async getByEmail(email: string): Promise<Colaborador | null> {
    const { data, error } = await supabase
      .from('colaboradores')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      console.error('Erro ao buscar colaborador por email:', error)
      throw error
    }
    
    return data || null
  },

  // Criar novo colaborador
  async create(colaborador: Omit<Colaborador, 'id' | 'created_at'>): Promise<Colaborador> {
    const { data, error } = await supabase
      .from('colaboradores')
      .insert({
        ...colaborador,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar colaborador:', error)
      throw error
    }
    
    return data
  },

  // Atualizar colaborador
  async update(id: string, updates: Partial<Colaborador>): Promise<Colaborador> {
    const { data, error } = await supabase
      .from('colaboradores')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao atualizar colaborador:', error)
      throw error
    }
    
    return data
  },

  // Deletar colaborador
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('colaboradores')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Erro ao deletar colaborador:', error)
      throw error
    }
  }
}