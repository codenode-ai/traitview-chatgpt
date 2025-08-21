import { supabase, type Organization } from '@/lib/supabaseClient'

// Funções para manipular organizações
export const companyService = {
  // Obter todas as organizações
  async getAll(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('name')
    
    if (error) {
      console.error('Erro ao buscar organizações:', error)
      throw error
    }
    
    return data || []
  },

  // Obter organização por ID
  async getById(id: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Erro ao buscar organização:', error)
      throw error
    }
    
    return data || null
  },

  // Criar nova organização
  async create(organization: Omit<Organization, 'id' | 'created_at'>): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .insert(organization)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar organização:', error)
      throw error
    }
    
    return data
  },

  // Atualizar organização
  async update(id: string, updates: Partial<Organization>): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao atualizar organização:', error)
      throw error
    }
    
    return data
  },

  // Deletar organização
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Erro ao deletar organização:', error)
      throw error
    }
  }
}