import { useState, useEffect } from 'react'
import { dataService, type Assessment } from '@/lib/dataService'

export const useAssessments = (companyId: string | null) => {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!companyId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await dataService.assessments.getByCompany(companyId)
        setAssessments(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [companyId])

  const addAssessment = async (assessment: Omit<Assessment, 'id' | 'created_at'>) => {
    try {
      const newAssessment = await dataService.assessments.create(assessment)
      setAssessments(prev => [...prev, newAssessment])
      return newAssessment
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const updateAssessment = async (id: string, updates: Partial<Assessment>) => {
    try {
      const updatedAssessment = await dataService.assessments.update(id, updates)
      setAssessments(prev => prev.map(a => a.id === id ? updatedAssessment : a))
      return updatedAssessment
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const deleteAssessment = async (id: string) => {
    try {
      await dataService.assessments.delete(id)
      setAssessments(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    assessments,
    loading,
    error,
    addAssessment,
    updateAssessment,
    deleteAssessment
  }
}