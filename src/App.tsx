import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Testes from "@/pages/Testes";
import EditarTeste from "@/pages/EditarTeste";
import Avaliacoes from "@/pages/Avaliacoes";
import Relatorios from "@/pages/Relatorios";
import AvaliacaoPublica from "@/pages/public/AvaliacaoPublica";
import NotFound from "@/pages/NotFound";
import { seedTestesOficiais } from "@/features/tests/seedTestesOficiais";
import { supabase } from "@/lib/supabaseClient";

export default function App() {
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Verificar conexão com Supabase e semear testes oficiais quando o app carrega
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Verificar conexão com Supabase
        const { data, error } = await supabase.from('testes').select('id').limit(1);
        
        if (error) {
          throw new Error(`Falha na conexão com Supabase: ${error.message}`);
        }
        
        console.log('App: Conexão com Supabase estabelecida com sucesso');
        setIsSupabaseReady(true);
        
        // Semear testes oficiais
        await seedTestesOficiais();
      } catch (error: any) {
        console.error('App: Erro ao inicializar aplicação:', error);
        setSupabaseError(error.message);
      }
    };

    initializeApp();
  }, []);

  if (!isSupabaseReady && !supabaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Inicializando aplicação...</p>
        </div>
      </div>
    );
  }

  if (supabaseError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Erro de Conexão</h1>
          <p className="text-muted-foreground mb-4">
            Não foi possível conectar ao banco de dados. Verifique suas credenciais do Supabase.
          </p>
          <p className="text-sm text-red-400 mb-4">{supabaseError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="testes" element={<Testes />} />
        <Route path="testes/editar/:id" element={<EditarTeste />} />
        <Route path="testes/criar" element={<EditarTeste />} />
        <Route path="avaliacoes" element={<Avaliacoes />} />
        <Route path="relatorios" element={<Relatorios />} />
      </Route>
      <Route path="/avaliacao/:token" element={<AvaliacaoPublica />} />
      <Route path="/avaliacao" element={<AvaliacaoPublica />} />
      <Route path="/teste-publico" element={<div className="p-10 text-center"><h1>Teste Público - Funcionando!</h1></div>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}