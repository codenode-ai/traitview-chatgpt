import { useAuthContext } from '@/providers/AuthProvider'
import { supabase } from '@/lib/supabaseClient'
import { dataService } from '@/lib/dataService'
import type { Usuario } from '@/lib/supabaseClient'

export const useAuth = () => {
  const { state, dispatch } = useAuthContext()

  const signIn = async (email: string, password: string) => {
    console.log('useAuth: signIn()', email)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      console.log('useAuth: signIn success', data)
      
      // Atualizar o contexto com os dados do usuário
      if (data.user) {
        // Buscar dados do usuário no banco de dados
        try {
          console.log('useAuth: Buscando usuário no banco de dados...')
          const usuario = await dataService.usuarios.getByEmail(data.user.email || '')
          console.log('useAuth: Usuário encontrado no banco', usuario)
          
          if (usuario) {
            dispatch({ type: 'SET_USER', payload: usuario })
          } else {
            // Se não encontrar no banco, criar um usuário básico
            console.log('useAuth: Criando usuário básico...')
            const novoUsuario: Omit<Usuario, 'id' | 'created_at'> = {
              email: data.user.email || '',
              nome: data.user.email?.split('@')[0] || '',
              tipo: 'editor',
              ativo: true
            }
            
            const usuarioCriado = await dataService.usuarios.create(novoUsuario)
            console.log('useAuth: Usuário básico criado', usuarioCriado)
            dispatch({ type: 'SET_USER', payload: usuarioCriado })
          }
        } catch (dbError) {
          console.error('useAuth: Erro ao buscar dados do usuário:', dbError)
          // Usar dados básicos do auth
          const usuarioBasico: Usuario = {
            id: data.user.id,
            email: data.user.email || '',
            nome: data.user.email?.split('@')[0] || '',
            tipo: 'editor',
            ativo: true,
            created_at: new Date().toISOString()
          }
          dispatch({ type: 'SET_USER', payload: usuarioBasico })
        }
      }
      
      return data
    } catch (error) {
      console.error('useAuth: Erro ao fazer login:', error)
      throw error
    }
  }

  const signOut = async () => {
    console.log('useAuth: signOut()')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      console.log('useAuth: signOut success')
      dispatch({ type: 'SET_USER', payload: null })
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
    console.log('useAuth: signUp()', email, nome, tipo)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) throw error
      
      console.log('useAuth: signUp success', data)
      
      // Criar registro de usuário no banco de dados
      if (data.user) {
        try {
          console.log('useAuth: Verificando se usuário já existe...')
          // Verificar se já existe um usuário com este email
          const usuarioExistente = await dataService.usuarios.getByEmail(email)
          
          if (usuarioExistente) {
            console.log('useAuth: Usuário já existe, usando o existente', usuarioExistente)
            // Se já existir, usar o existente
            dispatch({ type: 'SET_USER', payload: usuarioExistente })
          } else {
            console.log('useAuth: Criando novo usuário...')
            // Criar novo usuário com os dados fornecidos
            const novoUsuario: Omit<Usuario, 'id' | 'created_at'> = {
              email: data.user.email || '',
              nome: nome,
              tipo: tipo,
              ativo: true
            }
            
            const usuarioCriado = await dataService.usuarios.create(novoUsuario)
            console.log('useAuth: Usuário criado', usuarioCriado)
            dispatch({ type: 'SET_USER', payload: usuarioCriado })
            
            // Verificar se é o primeiro usuário para promover a admin
            const todosUsuarios = await dataService.usuarios.getAll()
            if (todosUsuarios.length === 1) {
              console.log('useAuth: Promovendo primeiro usuário a admin...')
              await dataService.usuarios.promoteToAdmin(usuarioCriado.id)
              // Atualizar o tipo do usuário no contexto
              dispatch({ 
                type: 'SET_USER', 
                payload: { ...usuarioCriado, tipo: 'admin' } 
              })
            }
          }
        } catch (dbError) {
          console.error('useAuth: Erro ao criar registro de usuário:', dbError)
          // Usar dados básicos do auth
          const usuarioBasico: Usuario = {
            id: data.user.id,
            email: data.user.email || '',
            nome: nome,
            tipo: tipo,
            ativo: true,
            created_at: new Date().toISOString()
          }
          dispatch({ type: 'SET_USER', payload: usuarioBasico })
        }
      }
      
      return data
    } catch (error) {
      console.error('useAuth: Erro ao criar conta:', error)
      throw error
    }
  }

  return {
    user: state.user,
    loading: state.loading,
    signIn,
    signOut,
    signUp,
  }
}