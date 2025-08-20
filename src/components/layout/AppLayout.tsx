import { NavLink, Outlet } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useDB } from "@/stores/db";
import { BarChart3, Users2, ClipboardList, ListChecks, PieChart } from "lucide-react";
import { motion } from "framer-motion";

export default function AppLayout() {
  const seed = useDB(s => s.seed);
  useEffect(() => { seed(); }, [seed]);

  return (
    <>
      <aside className="sidebar">
        <div className="p-6">
          <div className="text-2xl font-extrabold mb-1"><span className="text-black">Trait</span><span className="text-primary">View</span></div>
          <p className="text-xs text-muted-foreground mb-6">Completo • sem Supabase</p>
          <nav className="flex flex-col gap-1">
            <NavLink to="/" className="navlink"><BarChart3 size={18}/> Dashboard</NavLink>
            <NavLink to="/colaboradores" className="navlink"><Users2 size={18}/> Colaboradores</NavLink>
            <NavLink to="/testes" className="navlink"><ClipboardList size={18}/> Testes</NavLink>
            <NavLink to="/avaliacoes" className="navlink"><ListChecks size={18}/> Avaliações</NavLink>
            <NavLink to="/relatorios" className="navlink"><PieChart size={18}/> Relatórios</NavLink>
          </nav>
          <div className="mt-6">
            <a href="https://www.codenode.com.br/" target="_blank" className="text-xs underline">CodeNode.AI</a>
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="header">
          <div className="container-page flex items-center justify-between">
            <div className="font-semibold">TraitView • MVP (Local)</div>
            <div className="flex gap-2">
              <Button onClick={() => { localStorage.clear(); location.reload(); }} variant="outline">Resetar Dados</Button>
            </div>
          </div>
        </header>
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="p-4">
              <Outlet />
            </Card>
          </motion.div>
        </div>
      </main>
    </>
  );
}
