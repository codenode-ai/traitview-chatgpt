import { supabase } from '@/lib/supabaseClient'
import type { AccessLink } from '@/lib/supabaseClient'

// Funções para manipular links de acesso
export const accessLinksService = {
  // Criar um novo link de acesso
  async create(accessLink: Omit<AccessLink, 'id' | 'created_at' | 'expires_at'>): Promise<AccessLink> {
    // Calcular data de expiração (30 dias por padrão)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)
    
    const { data, error } = await supabase
      .from('access_links')
      .insert({
        ...accessLink,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar link de acesso:', error)
      throw error
    }
    
    return data
  },

  // Obter link de acesso por token
  async getByToken(token: string): Promise<AccessLink | null> {
    const { data, error } = await supabase
      .from('access_links')
      .select('*')
      .eq('token', token)
      .single()
    
    if (error) {
      console.error('Erro ao buscar link de acesso:', error)
      throw error
    }
    
    return data || null
  },

  // Marcar link como usado
  async markAsUsed(token: string): Promise<AccessLink> {
    const { data, error } = await supabase
      .from('access_links')
      .update({ 
        used: true,
        used_at: new Date().toISOString()
      })
      .eq('token', token)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao marcar link como usado:', error)
      throw error
    }
    
    return data
  },

  // Verificar se link está expirado
  isExpired(link: AccessLink): boolean {
    const now = new Date()
    const expiresAt = new Date(link.expires_at)
    return now > expiresAt
  },

  // Verificar se link já foi usado
  isUsed(link: AccessLink): boolean {
    return link.used
  }
}