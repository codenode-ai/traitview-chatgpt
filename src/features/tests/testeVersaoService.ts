import { supabase, type TesteVersao } from '@/lib/supabaseClient'

// Funções para manipular versões de testes
export const testeVersaoService = {
  // Obter todas as versões de um teste
  async getByTestId(testeId: string): Promise<TesteVersao[]> {
    const { data, error } = await supabase
      .from('testes_versoes')
      .select('*')
      .eq('teste_id', testeId)
      .order('versao', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar versões do teste:', error)
      throw error
    }
    
    return data || []
  },

  // Obter versão específica de um teste
  async getByTestIdAndVersion(testeId: string, versao: number): Promise<TesteVersao | null> {
    const { data, error } = await supabase
      .from('testes_versoes')
      .select('*')
      .eq('teste_id', testeId)
      .eq('versao', versao)
      .single()
    
    if (error) {
      console.error('Erro ao buscar versão do teste:', error)
      throw error
    }
    
    return data || null
  },

  // Criar novo registro de versão
  async create(versao: Omit<TesteVersao, 'id' | 'created_at'>): Promise<TesteVersao> {
    const { data, error } = await supabase
      .from('testes_versoes')
      .insert(versao)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar versão do teste:', error)
      throw error
    }
    
    return data
  },

  // Deletar versão
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('testes_versoes')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Erro ao deletar versão do teste:', error)
      throw error
    }
  }
}