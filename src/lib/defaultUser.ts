import type { Usuario } from '@/lib/supabaseClient'

// Usuário padrão para o sistema single-tenant
export const defaultUser: Usuario = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'admin@traitview.com',
  nome: 'Administrador',
  tipo: 'admin',
  ativo: true,
  created_at: new Date().toISOString()
}