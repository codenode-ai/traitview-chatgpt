import { supabase, type Usuario } from '@/lib/supabaseClient'
import { defaultUser } from '@/lib/defaultUser'

// Funções para manipular usuários no modo single-tenant
export const usuarioService = {
  // Obter todos os usuários (apenas o usuário padrão no single-tenant)
  async getAll(): Promise<Usuario[]> {
    console.log('usuarioService: getAll()')
    try {
      // Para single-tenant, retornar apenas o usuário padrão
      return [defaultUser]
    } catch (error) {
      console.error('usuarioService: Erro ao buscar usuários:', error)
      throw error
    }
  },

  // Obter usuário por ID (apenas o usuário padrão no single-tenant)
  async getById(id: string): Promise<Usuario | null> {
    console.log('usuarioService: getById()', id)
    try {
      // Para single-tenant, retornar o usuário padrão se o ID corresponder
      return id === defaultUser.id ? defaultUser : null
    } catch (error) {
      console.error('usuarioService: Erro ao buscar usuário:', error)
      throw error
    }
  },

  // Obter usuário por email (apenas o usuário padrão no single-tenant)
  async getByEmail(email: string): Promise<Usuario | null> {
    console.log('usuarioService: getByEmail()', email)
    try {
      // Para single-tenant, retornar o usuário padrão se o email corresponder
      return email === defaultUser.email ? defaultUser : null
    } catch (error) {
      console.error('usuarioService: Erro ao buscar usuário por email:', error)
      throw error
    }
  },

  // Criar novo usuário (não faz nada no single-tenant)
  async create(usuario: Omit<Usuario, 'id' | 'created_at'>): Promise<Usuario> {
    console.log('usuarioService: create()', usuario)
    try {
      // Para single-tenant, não criar novos usuários
      console.warn('Single-tenant: Não é possível criar novos usuários')
      return defaultUser
    } catch (error) {
      console.error('usuarioService: Erro ao criar usuário:', error)
      throw error
    }
  },

  // Atualizar usuário (não faz nada no single-tenant)
  async update(id: string, updates: Partial<Usuario>): Promise<Usuario> {
    console.log('usuarioService: update()', id, updates)
    try {
      // Para single-tenant, não atualizar usuários
      console.warn('Single-tenant: Não é possível atualizar usuários')
      return defaultUser
    } catch (error) {
      console.error('usuarioService: Erro ao atualizar usuário:', error)
      throw error
    }
  },

  // Deletar usuário (não faz nada no single-tenant)
  async delete(id: string): Promise<void> {
    console.log('usuarioService: delete()', id)
    try {
      // Para single-tenant, não deletar usuários
      console.warn('Single-tenant: Não é possível deletar usuários')
    } catch (error) {
      console.error('usuarioService: Erro ao deletar usuário:', error)
      throw error
    }
  },

  // Promover usuário a admin (não faz nada no single-tenant)
  async promoteToAdmin(id: string): Promise<Usuario> {
    console.log('usuarioService: promoteToAdmin()', id)
    try {
      // Para single-tenant, não promover usuários
      console.warn('Single-tenant: Não é possível promover usuários a admin')
      return defaultUser
    } catch (error) {
      console.error('usuarioService: Erro ao promover usuário a admin:', error)
      throw error
    }
  },

  // Obter usuário atual (apenas o usuário padrão no single-tenant)
  async getCurrentUser(): Promise<Usuario> {
    console.log('usuarioService: getCurrentUser()')
    try {
      // Para single-tenant, retornar o usuário padrão
      return defaultUser
    } catch (error) {
      console.error('usuarioService: Erro ao obter usuário atual:', error)
      throw error
    }
  },

  // Verificar se usuário é admin (apenas o usuário padrão no single-tenant)
  async isAdmin(): Promise<boolean> {
    console.log('usuarioService: isAdmin()')
    try {
      // Para single-tenant, o usuário padrão é sempre admin
      return defaultUser.tipo === 'admin'
    } catch (error) {
      console.error('usuarioService: Erro ao verificar se usuário é admin:', error)
      throw error
    }
  },

  // Verificar se usuário é editor (apenas o usuário padrão no single-tenant)
  async isEditor(): Promise<boolean> {
    console.log('usuarioService: isEditor()')
    try {
      // Para single-tenant, o usuário padrão é sempre editor
      return defaultUser.tipo === 'admin' || defaultUser.tipo === 'editor'
    } catch (error) {
      console.error('usuarioService: Erro ao verificar se usuário é editor:', error)
      throw error
    }
  },

  // Verificar se usuário é visualizador (apenas o usuário padrão no single-tenant)
  async isVisualizador(): Promise<boolean> {
    console.log('usuarioService: isVisualizador()')
    try {
      // Para single-tenant, o usuário padrão é sempre visualizador
      return defaultUser.tipo === 'admin' || defaultUser.tipo === 'editor' || defaultUser.tipo === 'visualizador'
    } catch (error) {
      console.error('usuarioService: Erro ao verificar se usuário é visualizador:', error)
      throw error
    }
  }
}