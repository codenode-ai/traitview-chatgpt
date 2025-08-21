import { companyService } from './companyService'
import { assessmentService } from './assessmentService'
import { questionService } from './questionService'
import { responseService } from './responseService'

// Serviço agregador que combina todos os serviços específicos
export const dataService = {
  companies: companyService,
  assessments: assessmentService,
  questions: questionService,
  responses: responseService
}

// Função para carregar todos os dados de um teste (incluindo perguntas)
export const loadAssessmentData = async (testId: string) => {
  try {
    // Carregar o teste
    const test = await assessmentService.getById(testId)
    if (!test) {
      throw new Error('Teste não encontrado')
    }
    
    // Carregar perguntas do teste
    const questions = await questionService.getByAssessment(testId)
    
    return {
      assessment: test,
      questions
    }
  } catch (error) {
    console.error('Erro ao carregar dados do teste:', error)
    throw error
  }
}

// Função para salvar respostas de um questionário
export const saveAssessmentResponse = async (
  orgId: string,
  testId: string,
  candidateName: string | null,
  candidateEmail: string | null,
  answers: { questionId: string; value: number }[]
) => {
  try {
    // Criar registro de avaliação
    const evaluation = await responseService.create({
      org_id: orgId,
      test_id: testId,
      candidate_name: candidateName || '',
      candidate_email: candidateEmail
    })
    
    // Salvar respostas individuais
    const evaluationAnswers = await Promise.all(
      answers.map(({ questionId, value }) =>
        responseService.addAnswer({
          evaluation_id: evaluation.id,
          question_id: questionId,
          value
        })
      )
    )
    
    // Marcar avaliação como concluída
    await responseService.completeEvaluation(evaluation.id)
    
    return {
      evaluation,
      evaluationAnswers
    }
  } catch (error) {
    console.error('Erro ao salvar respostas do questionário:', error)
    throw error
  }
}