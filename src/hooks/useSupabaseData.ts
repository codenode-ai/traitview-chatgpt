import { useEffect, useState } from 'react';
import { getSource } from '@/data';
import type { Collaborator, Test, Evaluation } from '@/types';
import { useDB } from '@/stores/db';

interface SupabaseData {
  loading: boolean;
  error: Error | null;
}

export const useSupabaseData = (orgId: string) => {
  const [data, setData] = useState<SupabaseData>({
    loading: true,
    error: null
  });
  const { setCollaborators, setTests, setEvaluations } = useDB();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verificar se estamos usando Supabase
        if (import.meta.env.VITE_DATA_SOURCE !== "supabase") {
          setData({
            loading: false,
            error: null
          });
          return;
        }

        const source = await getSource();
        
        // Buscar dados do Supabase
        const collaborators = await source.getCollaborators();
        const tests = await source.getTests(orgId);
        const evaluations = await source.getEvaluations(orgId);
        
        // Atualizar o estado da aplicação com os dados do Supabase
        setCollaborators(collaborators);
        setTests(tests);
        setEvaluations(evaluations);
        
        setData({
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('[useSupabaseData] Erro ao buscar dados do Supabase:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error as Error
        }));
      }
    };

    fetchData();
  }, [orgId, setCollaborators, setTests, setEvaluations]);

  return data;
};