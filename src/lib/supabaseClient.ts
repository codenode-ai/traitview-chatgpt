import { createClient } from '@supabase/supabase-js'

// Tipos para as tabelas do Supabase
export interface Organization {
  id: string
  created_at: string
  name: string
}

export interface Profile {
  id: string
  org_id: string
  full_name: string | null
  role: string
  created_at: string
}

export interface Test {
  id: string
  org_id: string
  name: string
  description: string | null
  created_at: string
}

export interface Question {
  id: string
  test_id: string
  text: string
  dimension: string
  created_at: string
}

export interface Evaluation {
  id: string
  org_id: string
  test_id: string
  candidate_name: string
  candidate_email: string | null
  status: 'pending' | 'completed'
  created_at: string
}

export interface Answer {
  id: string
  evaluation_id: string
  question_id: string
  value: number
  created_at: string
}

export interface Report {
  id: string
  evaluation_id: string
  summary: string | null
  pdf_url: string | null
  created_at: string
}

// Definindo o tipo para o cliente do Supabase
export type SupabaseClient = ReturnType<typeof createClient>

// Criando o cliente do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)