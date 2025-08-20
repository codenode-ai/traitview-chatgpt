import { Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Colaboradores from "@/pages/Colaboradores";
import Testes from "@/pages/Testes";
import Avaliacoes from "@/pages/Avaliacoes";
import Relatorios from "@/pages/Relatorios";
import AvaliacaoPublica from "@/pages/public/AvaliacaoPublica";
import NotFound from "@/pages/NotFound";

export default function App() {
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
