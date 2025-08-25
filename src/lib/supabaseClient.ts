import { createClient } from '@supabase/supabase-js'

// Tipos para as tabelas do Supabase conforme o PRD
export interface Usuario {
  id: string
  email: string
  nome: string
  tipo: 'admin' | 'editor' | 'visualizador'
  ativo: boolean
  created_at: string
}

export interface Colaborador {
  id: string
  nome: string
  email: string
  cargo: string | null
  departamento: string | null
  ativo: boolean
  created_at: string
}

export interface Teste {
  id: string
  codigo: string
  nome: string
  descricao: string | null
  categoria: string | null
  perguntas: { id: number; texto: string; ordem: number }[]
  faixas_interpretacao: { min: number; max: number; label: string; cor: string }[]
  tipo: 'oficial' | 'customizado'
  criado_por: string | null
  versao: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface TesteVersao {
  id: string
  teste_id: string
  versao: number
  alterado_por: string
  alteracoes: string | null
  snapshot_teste: any
  created_at: string
}

export interface Avaliacao {
  id: string
  nome: string
  descricao: string | null
  criado_por: string
  testes_ids: string[]
  status: 'rascunho' | 'enviada' | 'concluida'
  created_at: string
}

export interface Resposta {
  id: string
  avaliacao_id: string
  colaborador_id: string
  teste_id: string
  teste_versao: number
  link_acesso: string
  respostas: { pergunta_id: number; resposta: number; pergunta_texto: string }[] | null
  resultado: { score: number; faixa: string; interpretacao: string } | null
  status: 'pendente' | 'iniciada' | 'concluida'
  iniciado_em: string | null
  concluido_em: string | null
  created_at: string
}

// Definindo o tipo para o cliente do Supabase
export type SupabaseClient = ReturnType<typeof createClient>

// Criando o cliente do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)