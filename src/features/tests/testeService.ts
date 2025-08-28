import { supabase, type Teste } from '@/lib/supabaseClient'

// Funções para manipular testes
export const testeService = {
  // Obter todos os testes
  async getAll(): Promise<Teste[]> {
    const { data, error } = await supabase
      .from('testes')
      .select('*')
      .order('nome')
    
    if (error) {
      console.error('Erro ao buscar testes:', error)
      throw error
    }
    
    return data || []
  },

  // Obter teste por ID
  async getById(id: string): Promise<Teste | null> {
    const { data, error } = await supabase
      .from('testes')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Erro ao buscar teste:', error)
      throw error
    }
    
    return data || null
  },

  // Obter teste por código
  async getByCodigo(codigo: string): Promise<Teste | null> {
    const { data, error } = await supabase
      .from('testes')
      .select('*')
      .eq('codigo', codigo)
      .single()
    
    if (error) {
      console.error('Erro ao buscar teste por código:', error)
      throw error
    }
    
    return data || null
  },

  // Criar novo teste
  async create(teste: Omit<Teste, 'id' | 'created_at' | 'updated_at' | 'versao' | 'ativo'>): Promise<Teste> {
    const { data, error } = await supabase
      .from('testes')
      .insert({
        ...teste,
        versao: 1,
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar teste:', error)
      throw error
    }
    
    return data
  },

  // Atualizar teste
  async update(id: string, updates: Partial<Omit<Teste, 'id' | 'created_at' | 'updated_at' | 'versao' | 'ativo'>>): Promise<Teste> {
    const { data, error } = await supabase
      .from('testes')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao atualizar teste:', error)
      throw error
    }
    
    return data
  },

  // Deletar teste
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('testes')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Erro ao deletar teste:', error)
      throw error
    }
  },

  // Duplicar teste
  async duplicate(id: string): Promise<Teste> {
    const teste = await this.getById(id)
    if (!teste) {
      throw new Error('Teste não encontrado')
    }

    const { data, error } = await supabase
      .from('testes')
      .insert({
        codigo: `${teste.codigo}_copy`,
        nome: `${teste.nome} (Cópia)`,
        descricao: teste.descricao,
        categoria: teste.categoria,
        perguntas: teste.perguntas,
        faixas_interpretacao: teste.faixas_interpretacao,
        tipo: teste.tipo,
        criado_por: teste.criado_por,
        versao: 1,
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao duplicar teste:', error)
      throw error
    }
    
    return data
  }
}