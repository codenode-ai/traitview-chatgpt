import { useState, useEffect } from 'react'
import { dataService, loadAssessmentData, type Question } from '@/lib/dataService'

export const useQuestions = (assessmentId: string | null) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!assessmentId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await dataService.questions.getByAssessment(assessmentId)
        setQuestions(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [assessmentId])

  const addQuestion = async (question: Omit<Question, 'id' | 'created_at'>) => {
    try {
      const newQuestion = await dataService.questions.create(question)
      setQuestions(prev => [...prev, newQuestion])
      return newQuestion
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const updateQuestion = async (id: string, updates: Partial<Question>) => {
    try {
      const updatedQuestion = await dataService.questions.update(id, updates)
      setQuestions(prev => prev.map(q => q.id === id ? updatedQuestion : q))
      return updatedQuestion
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const deleteQuestion = async (id: string) => {
    try {
      await dataService.questions.delete(id)
      setQuestions(prev => prev.filter(q => q.id !== id))
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const reorderQuestions = async (reorderedQuestions: { id: string; order: number }[]) => {
    try {
      await dataService.questions.reorder(reorderedQuestions)
      // Atualizar a ordem local após reordenar no banco
      setQuestions(prev => {
        const updated = [...prev]
        reorderedQuestions.forEach(({ id, order }) => {
          const index = updated.findIndex(q => q.id === id)
          if (index !== -1) {
            updated[index] = { ...updated[index], order }
          }
        })
        return updated.sort((a, b) => a.order - b.order)
      })
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    questions,
    loading,
    error,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions
  }
}