import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { dataService } from '@/lib/dataService'
import { promoteFirstUserToAdmin } from '@/lib/promoteFirstUser'
import type { Usuario } from '@/lib/supabaseClient'

// Tipos para o contexto de autenticação
type AuthState = {
  user: Usuario | null
  loading: boolean
}

type AuthAction =
  | { type: 'SET_USER'; payload: Usuario | null }
  | { type: 'SET_LOADING'; payload: boolean }

// Estado inicial
const initialState: AuthState = {
  user: null,
  loading: true,
}

// Reducer para gerenciar o estado de autenticação
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      console.log('AuthProvider: SET_USER reducer', action.payload)
      return {
        ...state,
        user: action.payload,
        loading: false,
      }
    case 'SET_LOADING':
      console.log('AuthProvider: SET_LOADING reducer', action.payload)
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state
  }
}

// Criar contexto
const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
}>({
  state: initialState,
  dispatch: () => null,
})

// Provider de autenticação
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    console.log('AuthProvider: useEffect inicializado')
    
    // Verificar sessão atual com um pequeno delay para garantir que o Supabase esteja pronto
    const checkSession = async () => {
      try {
        console.log('AuthProvider: Verificando sessão...')
        // Adicionar um pequeno delay para garantir que o Supabase esteja pronto
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const { data: { session } } = await supabase.auth.getSession()
        console.log('AuthProvider: Sessão obtida', session)
        
        if (session?.user) {
          console.log('AuthProvider: Usuário autenticado, buscando dados...')
          // Buscar dados do usuário no banco de dados
          try {
            const usuario = await dataService.usuarios.getByEmail(session.user.email || '')
            console.log('AuthProvider: Usuário encontrado no banco', usuario)
            
            if (usuario) {
              dispatch({ type: 'SET_USER', payload: usuario })
            } else {
              // Se não encontrar no banco, criar um usuário básico
              console.log('AuthProvider: Criando usuário básico...')
              const novoUsuario = await dataService.usuarios.create({
                email: session.user.email || '',
                nome: session.user.email?.split('@')[0] || '',
                tipo: 'editor',
                ativo: true
              })
              console.log('AuthProvider: Usuário básico criado', novoUsuario)
              dispatch({ type: 'SET_USER', payload: novoUsuario })
            }
          } catch (dbError) {
            console.error('AuthProvider: Erro ao buscar dados do usuário:', dbError)
            // Usar dados básicos do auth
            const usuarioBasico: Usuario = {
              id: session.user.id,
              email: session.user.email || '',
              nome: session.user.email?.split('@')[0] || '',
              tipo: 'editor',
              ativo: true,
              created_at: new Date().toISOString()
            }
            dispatch({ type: 'SET_USER', payload: usuarioBasico })
          }
        } else {
          console.log('AuthProvider: Nenhum usuário autenticado')
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('AuthProvider: Erro ao verificar sessão:', error)
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkSession()

    // Escutar mudanças na autenticação
    console.log('AuthProvider: Configurando listener de autenticação...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log('AuthProvider: Mudança de estado de autenticação', _event, session)
        
        if (session?.user) {
          console.log('AuthProvider: Novo usuário autenticado, buscando dados...')
          // Buscar dados do usuário no banco de dados
          try {
            const usuario = await dataService.usuarios.getByEmail(session.user.email || '')
            console.log('AuthProvider: Usuário encontrado no banco', usuario)
            
            if (usuario) {
              dispatch({ type: 'SET_USER', payload: usuario })
            } else {
              // Se não encontrar no banco, criar um usuário básico
              console.log('AuthProvider: Criando usuário básico...')
              const novoUsuario = await dataService.usuarios.create({
                email: session.user.email || '',
                nome: session.user.email?.split('@')[0] || '',
                tipo: 'editor',
                ativo: true
              })
              console.log('AuthProvider: Usuário básico criado', novoUsuario)
              dispatch({ type: 'SET_USER', payload: novoUsuario })
              
              // Verificar se é o primeiro usuário para promover a admin
              setTimeout(() => {
                promoteFirstUserToAdmin()
              }, 1000)
            }
          } catch (dbError) {
            console.error('AuthProvider: Erro ao buscar dados do usuário:', dbError)
            // Usar dados básicos do auth
            const usuarioBasico: Usuario = {
              id: session.user.id,
              email: session.user.email || '',
              nome: session.user.email?.split('@')[0] || '',
              tipo: 'editor',
              ativo: true,
              created_at: new Date().toISOString()
            }
            dispatch({ type: 'SET_USER', payload: usuarioBasico })
          }
        } else {
          console.log('AuthProvider: Usuário desconectado')
          dispatch({ type: 'SET_USER', payload: null })
        }
      }
    )

    return () => {
      console.log('AuthProvider: Limpando subscrição')
      subscription.unsubscribe()
    }
  }, [])

  console.log('AuthProvider: Renderizando com state', state)
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto de autenticação
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  console.log('useAuthContext: Retornando contexto', context.state)
  return context
}