import { useState, useEffect } from 'react'
import { dataService, type Company } from '@/lib/dataService'

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true)
        const data = await dataService.companies.getAll()
        setCompanies(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  const addCompany = async (company: Omit<Company, 'id' | 'created_at'>) => {
    try {
      const newCompany = await dataService.companies.create(company)
      setCompanies(prev => [...prev, newCompany])
      return newCompany
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const updatedCompany = await dataService.companies.update(id, updates)
      setCompanies(prev => prev.map(c => c.id === id ? updatedCompany : c))
      return updatedCompany
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  const deleteCompany = async (id: string) => {
    try {
      await dataService.companies.delete(id)
      setCompanies(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      setError(err as Error)
      throw err
    }
  }

  return {
    companies,
    loading,
    error,
    addCompany,
    updateCompany,
    deleteCompany
  }
}