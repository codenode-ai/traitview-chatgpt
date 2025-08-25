import { useState } from 'react'
import { dataService, saveAssessmentResponse, type Response, type ResponseAnswer } from '@/lib/dataService'

export const useResponses = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createResponse = async (
    assessmentId: string,
    respondentName: string | null,
    respondentEmail: string | null
  ): Promise<Response> => {
    try {
      setLoading(true)
      const response = await dataService.responses.create({
        assessment_id: assessmentId,
        respondent_name: respondentName,
        respondent_email: respondentEmail
      })
      return response
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const addAnswer = async (
    responseId: string,
    questionId: string,
    answerOptionId: string
  ): Promise<ResponseAnswer> => {
    try {
      setLoading(true)
      const answer = await dataService.responses.addAnswer({
        response_id: responseId,
        question_id: questionId,
        answer_option_id: answerOptionId
      })
      return answer
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getResponseAnswers = async (responseId: string): Promise<ResponseAnswer[]> => {
    try {
      setLoading(true)
      const answers = await dataService.responses.getAnswers(responseId)
      return answers
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const saveAssessmentResponses = async (
    assessmentId: string,
    respondentName: string | null,
    respondentEmail: string | null,
    answers: { questionId: string; answerOptionId: string }[]
  ) => {
    try {
      setLoading(true)
      const result = await saveAssessmentResponse(
        assessmentId,
        respondentName,
        respondentEmail,
        answers
      )
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    createResponse,
    addAnswer,
    getResponseAnswers,
    saveAssessmentResponses
  }
}