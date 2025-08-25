import { dataService } from '@/lib/dataService'

// Função para promover o primeiro usuário a admin
export const promoteFirstUserToAdmin = async () => {
  try {
    // Buscar todos os usuários
    const usuarios = await dataService.usuarios.getAll()
    
    // Se houver apenas um usuário e ele não for admin, promover a admin
    if (usuarios.length === 1 && usuarios[0].tipo !== 'admin') {
      const usuario = usuarios[0]
      await dataService.usuarios.promoteToAdmin(usuario.id)
      console.log(`Usuário ${usuario.email} promovido a admin`)
      return true
    }
    
    // Se não houver usuários, aguardar e tentar novamente
    if (usuarios.length === 0) {
      console.log('Nenhum usuário encontrado, aguardando criação...')
      return false
    }
    
    console.log('Já existe pelo menos um usuário admin ou múltiplos usuários')
    return false
  } catch (error) {
    console.error('Erro ao promover primeiro usuário a admin:', error)
    return false
  }
}