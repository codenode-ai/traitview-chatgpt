import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuthContext } from "@/providers/AuthProvider";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Colaboradores from "@/pages/Colaboradores";
import Testes from "@/pages/Testes";
import Avaliacoes from "@/pages/Avaliacoes";
import Relatorios from "@/pages/Relatorios";
import AvaliacaoPublica from "@/pages/public/AvaliacaoPublica";
import NotFound from "@/pages/NotFound";
import LoginForm from "@/features/auth/LoginForm";
import { seedTestesOficiais } from "@/features/tests/seedTestesOficiais";

export default function App() {
  const { state } = useAuthContext();
  console.log('App.tsx: Renderizando', { user: state.user, loading: state.loading })

  // Verificar se usuário está autenticado
  const isAuthenticated = !!state.user;
  const loading = state.loading;

  // Semear testes oficiais quando o app carrega
  useEffect(() => {
    console.log('App.tsx: useEffect - Iniciando seed de testes oficiais')
    seedTestesOficiais();
  }, []);

  if (loading) {
    console.log('App.tsx: Mostrando tela de carregamento')
    return <div className="p-10 text-center">Carregando...</div>;
  }

  // Se não estiver autenticado e não estiver na página pública de avaliação, mostrar login
  const isPublicRoute = location.pathname.startsWith("/avaliacao/");
  
  if (!isAuthenticated && !isPublicRoute && location.pathname !== "/login") {
    console.log('App.tsx: Usuário não autenticado, redirecionando para login')
    return <LoginForm />;
  }

  console.log('App.tsx: Renderizando rotas protegidas')
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/avaliacao/:token" element={<AvaliacaoPublica />} />
      
      {/* Login */}
      <Route path="/login" element={<LoginForm />} />
      
      {/* Rotas protegidas */}
      {isAuthenticated ? (
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="colaboradores" element={<Colaboradores />} />
          <Route path="testes" element={<Testes />} />
          <Route path="avaliacoes" element={<Avaliacoes />} />
          <Route path="relatorios" element={<Relatorios />} />
        </Route>
      ) : null}
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}