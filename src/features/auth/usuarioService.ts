import { supabase, type Usuario } from '@/lib/supabaseClient'

// Funções para manipular usuários
export const usuarioService = {
  // Obter todos os usuários
  async getAll(): Promise<Usuario[]> {
    console.log('usuarioService: getAll()')
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nome')
    
    if (error) {
      console.error('usuarioService: Erro ao buscar usuários:', error)
      throw error
    }
    
    console.log('usuarioService: Usuários encontrados:', data)
    return data || []
  },

  // Obter usuário por ID
  async getById(id: string): Promise<Usuario | null> {
    console.log('usuarioService: getById()', id)
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('usuarioService: Erro ao buscar usuário:', error)
      throw error
    }
    
    console.log('usuarioService: Usuário encontrado:', data)
    return data || null
  },

  // Obter usuário por email
  async getByEmail(email: string): Promise<Usuario | null> {
    console.log('usuarioService: getByEmail()', email)
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) {
      console.error('usuarioService: Erro ao buscar usuário por email:', error)
      throw error
    }
    
    console.log('usuarioService: Usuário encontrado por email:', data)
    return data || null
  },

  // Criar novo usuário
  async create(usuario: Omit<Usuario, 'id' | 'created_at'>): Promise<Usuario> {
    console.log('usuarioService: create()', usuario)
    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        ...usuario,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('usuarioService: Erro ao criar usuário:', error)
      throw error
    }
    
    console.log('usuarioService: Usuário criado:', data)
    return data
  },

  // Atualizar usuário
  async update(id: string, updates: Partial<Usuario>): Promise<Usuario> {
    console.log('usuarioService: update()', id, updates)
    const { data, error } = await supabase
      .from('usuarios')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('usuarioService: Erro ao atualizar usuário:', error)
      throw error
    }
    
    console.log('usuarioService: Usuário atualizado:', data)
    return data
  },

  // Deletar usuário
  async delete(id: string): Promise<void> {
    console.log('usuarioService: delete()', id)
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('usuarioService: Erro ao deletar usuário:', error)
      throw error
    }
    
    console.log('usuarioService: Usuário deletado')
  },

  // Promover usuário a admin (para o primeiro usuário)
  async promoteToAdmin(id: string): Promise<Usuario> {
    console.log('usuarioService: promoteToAdmin()', id)
    const { data, error } = await supabase
      .from('usuarios')
      .update({ tipo: 'admin' })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('usuarioService: Erro ao promover usuário a admin:', error)
      throw error
    }
    
    console.log('usuarioService: Usuário promovido a admin:', data)
    return data
  }
}