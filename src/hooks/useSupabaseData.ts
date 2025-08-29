import { useEffect, useState } from 'react';
import { dataService } from '@/lib/dataService';
import type { Colaborador, Teste, Avaliacao } from '@/lib/supabaseClient';

interface SupabaseData {
  loading: boolean;
  error: Error | null;
}

export const useSupabaseData = () => {
  const [data, setData] = useState<SupabaseData>({
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData({
          loading: true,
          error: null
        });

        // Os dados são carregados automaticamente pelos componentes que os usam
        setData({
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('[useSupabaseData] Erro ao inicializar dados:', error);
        setData({
          loading: false,
          error: error as Error
        });
      }
    };

    fetchData();
  }, []);

  return data;
};