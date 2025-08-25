import { usuarioService } from '@/features/auth/usuarioService'
import { colaboradorService } from '@/features/collaborators/colaboradorService'
import { testeService } from '@/features/tests/testeService'
import { testeVersaoService } from '@/features/tests/testeVersaoService'
import { avaliacaoService } from '@/features/assessments/avaliacaoService'
import { respostaService } from '@/features/responses/respostaService'

// Serviço agregador que combina todos os serviços específicos
export const dataService = {
  usuarios: usuarioService,
  colaboradores: colaboradorService,
  testes: testeService,
  testesVersoes: testeVersaoService,
  avaliacoes: avaliacaoService,
  respostas: respostaService
}

// Função para carregar todos os dados de um teste (incluindo perguntas)
export const loadTestData = async (testeId: string) => {
  try {
    // Carregar o teste
    const teste = await testeService.getById(testeId)
    if (!teste) {
      throw new Error('Teste não encontrado')
    }
    
    return teste
  } catch (error) {
    console.error('Erro ao carregar dados do teste:', error)
    throw error
  }
}

// Função para salvar respostas de um teste
export const saveTestResponse = async (
  avaliacaoId: string,
  colaboradorId: string,
  testeId: string,
  respostas: { pergunta_id: number; resposta: number; pergunta_texto: string }[]
) => {
  try {
    // Criar registro de resposta
    const resposta = await respostaService.create({
      avaliacao_id: avaliacaoId,
      colaborador_id: colaboradorId,
      teste_id: testeId,
      teste_versao: 1, // TODO: Obter a versão correta do teste
      respostas: null,
      resultado: null
    })
    
    // Salvar respostas individuais
    await respostaService.salvarRespostas(resposta.id, respostas)
    
    // Marcar resposta como concluída
    await respostaService.marcarComoConcluida(resposta.id)
    
    return resposta
  } catch (error) {
    console.error('Erro ao salvar respostas do teste:', error)
    throw error
  }
}

// ====================
// FUNÇÕES RPC
// ====================

// Validar token e obter dados da resposta
export const validarTokenEObterDados = async (token: string) => {
  try {
    const data = await respostaService.validarTokenEObterDados(token)
    return data
  } catch (error) {
    console.error('Erro ao validar token e obter dados:', error)
    throw error
  }
}

// Salvar respostas validando token
export const salvarRespostasComToken = async (
  token: string,
  respostas: { pergunta_id: number; resposta: number; pergunta_texto: string }[]
) => {
  try {
    const result = await respostaService.salvarRespostasComToken(token, respostas)
    return result
  } catch (error) {
    console.error('Erro ao salvar respostas com token:', error)
    throw error
  }
}

// Marcar resposta como iniciada via token
export const marcarRespostaIniciada = async (token: string) => {
  try {
    const result = await respostaService.marcarRespostaIniciada(token)
    return result
  } catch (error) {
    console.error('Erro ao marcar resposta como iniciada:', error)
    throw error
  }
}