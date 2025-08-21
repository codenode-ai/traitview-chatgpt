import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Colaboradores from "@/pages/Colaboradores";
import Testes from "@/pages/Testes";
import Avaliacoes from "@/pages/Avaliacoes";
import Relatorios from "@/pages/Relatorios";
import AvaliacaoPublica from "@/pages/public/AvaliacaoPublica";
import NotFound from "@/pages/NotFound";
import { useDB } from "@/stores/db";
import { useSupabaseData } from "@/hooks/useSupabaseData";

// TODO: Obter o ID da organização de alguma forma (por exemplo, do contexto de autenticação)
const ORG_ID = "11111111-1111-1111-1111-111111111111"; // ID da organização demo

export default function App() {
  const navigate = useNavigate();
  const { seed, clear } = useDB();
  const { loading, error } = useSupabaseData(ORG_ID);

  useEffect(() => {
    // Limpar dados do Zustand se estiver usando Supabase
    if (import.meta.env.VITE_DATA_SOURCE === "supabase") {
      clear();
    } else {
      // Inicializar o estado da aplicação com dados mockados apenas se estiver usando fonte local
      seed();
    }
  }, [seed, clear]);

  // Redirecionar para a página inicial se houver erro ao buscar dados do Supabase
  useEffect(() => {
    if (error) {
      console.error("Erro ao carregar dados do Supabase:", error);
      // TODO: Mostrar mensagem de erro para o usuário
    }
  }, [error, navigate]);

  if (loading && import.meta.env.VITE_DATA_SOURCE === "supabase") {
    return <div className="p-10 text-center">Carregando dados...</div>;
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="colaboradores" element={<Colaboradores />} />
        <Route path="testes" element={<Testes />} />
        <Route path="avaliacoes" element={<Avaliacoes />} />
        <Route path="relatorios" element={<Relatorios />} />
      </Route>
      <Route path="/avaliacao/:token" element={<AvaliacaoPublica />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
