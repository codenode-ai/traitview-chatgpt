import { supabase } from '@/lib/supabaseClient'
import { dataService } from '@/lib/dataService'
import { TESTES_OFICIAIS } from './testesOficiais'

// Função para semear os testes oficiais no banco de dados
export const seedTestesOficiais = async () => {
  try {
    console.log('Iniciando seed dos testes oficiais...')
    
    // Verificar se já existem testes oficiais
    const { data: existingTests, error: fetchError } = await supabase
      .from('testes')
      .select('codigo')
      .eq('tipo', 'oficial')
    
    if (fetchError) {
      console.error('Erro ao buscar testes existentes:', fetchError)
      return
    }
    
    // Se já existirem testes oficiais, não fazer nada
    if (existingTests && existingTests.length > 0) {
      console.log('Testes oficiais já existem no banco de dados')
    } else {
      // Inserir os testes oficiais
      const testesParaInserir = TESTES_OFICIAIS.map(teste => ({
        codigo: teste.codigo,
        nome: teste.nome,
        descricao: teste.descricao,
        categoria: teste.categoria,
        perguntas: teste.perguntas,
        faixas_interpretacao: teste.faixas_interpretacao,
        tipo: 'oficial',
        criado_por: null, // Será preenchido quando um usuário criar o teste
        versao: 1,
        ativo: true
      }))
      
      const { data, error } = await supabase
        .from('testes')
        .insert(testesParaInserir)
      
      if (error) {
        console.error('Erro ao inserir testes oficiais:', error)
        return
      }
      
      console.log('Testes oficiais inseridos com sucesso:', data)
    }
    
    // Verificar se existe algum usuário admin
    const { data: adminUsers, error: adminError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('tipo', 'admin')
    
    if (adminError) {
      console.error('Erro ao buscar usuários admin:', adminError)
      return
    }
    
    // Se não existir nenhum usuário admin, criar um padrão
    if (!adminUsers || adminUsers.length === 0) {
      console.log('Nenhum usuário admin encontrado, criando usuário admin padrão...')
      
      // Verificar se há algum usuário registrado no auth
      const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.error('Erro ao buscar usuários do auth:', authError)
        return
      }
      
      // Se houver usuários no auth, promover o primeiro como admin
      if (users && users.length > 0) {
        const firstUser = users[0]
        try {
          await dataService.usuarios.create({
            email: firstUser.email,
            nome: firstUser.email?.split('@')[0] || 'Admin',
            tipo: 'admin',
            ativo: true
          })
          console.log('Usuário admin criado com sucesso')
        } catch (createError) {
          console.error('Erro ao criar usuário admin:', createError)
        }
      }
    }
  } catch (error) {
    console.error('Erro ao semear testes oficiais:', error)
  }
}