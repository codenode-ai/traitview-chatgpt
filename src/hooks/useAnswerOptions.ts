import { useState, useEffect } from 'react'
import { dataService, type AnswerOption } from '@/lib/dataService'

export const useAnswerOptions = (questionId: string | null) => {
  const [answerOptions, setAnswerOptions] = useState<AnswerOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchAnswerOptions = async () => {
      if (!questionId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await dataService.answerOptions.getByQuestion(questionId)
        setAnswerOptions(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnswerOptions()
  }, [questionId])

  const addAnswerOption = async (option: Omit<AnswerOption, 'id' | 'created_at'>) => {
    try {
      const newOption = await dataService.answerOptions.create(option)
      setAnswerOptions(prev => [...prev, newOption])
      return newOption
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const updateAnswerOption = async (id: string, updates: Partial<AnswerOption>) => {
    try {
      const updatedOption = await dataService.answerOptions.update(id, updates)
      setAnswerOptions(prev => prev.map(o => o.id === id ? updatedOption : o))
      return updatedOption
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const deleteAnswerOption = async (id: string) => {
    try {
      await dataService.answerOptions.delete(id)
      setAnswerOptions(prev => prev.filter(o => o.id !== id))
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const reorderAnswerOptions = async (reorderedOptions: { id: string; order: number }[]) => {
    try {
      await dataService.answerOptions.reorder(reorderedOptions)
      // Atualizar a ordem local após reordenar no banco
      setAnswerOptions(prev => {
        const updated = [...prev]
        reorderedOptions.forEach(({ id, order }) => {
          const index = updated.findIndex(o => o.id === id)
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
    answerOptions,
    loading,
    error,
    addAnswerOption,
    updateAnswerOption,
    deleteAnswerOption,
    reorderAnswerOptions
  }
}