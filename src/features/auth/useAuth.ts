import { useState, useEffect } from 'react'
import { dataService } from '@/lib/dataService'
import type { Usuario } from '@/lib/supabaseClient'

export const useAuth = () => {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar usuário padrão no modo single-tenant
    const loadUser = async () => {
      try {
        console.log('useAuth: Carregando usuário padrão...')
        const usuario = await dataService.usuarios.getCurrentUser()
        console.log('useAuth: Usuário padrão carregado', usuario)
        setUser(usuario)
      } catch (error) {
        console.error('useAuth: Erro ao carregar usuário padrão:', error)
        // Usar usuário padrão mesmo em caso de erro
        setUser(dataService.defaultUser)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('useAuth: signIn()', email)
      // No modo single-tenant, qualquer login válido retorna o usuário padrão
      const usuario = await dataService.usuarios.getCurrentUser()
      setUser(usuario)
      return { user: usuario }
    } catch (error) {
      console.error('useAuth: Erro ao fazer login:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      console.log('useAuth: signOut()')
      // No modo single-tenant, apenas limpar o estado
      setUser(null)
    } catch (error) {
      console.error('useAuth: Erro ao fazer logout:', error)
      throw error
    }
  }

  const signUp = async (
    email: string, 
    password: string, 
    nome: string, 
    tipo: 'admin' | 'editor' | 'visualizador' = 'editor'
  ) => {
    try {
      console.log('useAuth: signUp()', email, nome, tipo)
      // No modo single-tenant, não criar novos usuários
      const usuario = await dataService.usuarios.getCurrentUser()
      setUser(usuario)
      return { user: usuario }
    } catch (error) {
      console.error('useAuth: Erro ao criar conta:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    signUp,
  }
}