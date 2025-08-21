import { NavLink, Outlet } from "react-router-dom";
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
          <div className="text-2xl font-extrabold mb-1"><span className="text-white">Trait</span><span className="text-vibrant-blue">View</span></div>
          <p className="text-xs text-dark-text-secondary mb-6">Completo • sem Supabase</p>
          <nav className="flex flex-col gap-1">
            <NavLink to="/" className="navlink" end>
              <BarChart3 size={20}/> 
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/colaboradores" className="navlink">
              <Users2 size={20}/> 
              <span>Colaboradores</span>
            </NavLink>
            <NavLink to="/testes" className="navlink">
              <ClipboardList size={20}/> 
              <span>Testes</span>
            </NavLink>
            <NavLink to="/avaliacoes" className="navlink">
              <ListChecks size={20}/> 
              <span>Avaliações</span>
            </NavLink>
            <NavLink to="/relatorios" className="navlink">
              <PieChart size={20}/> 
              <span>Relatórios</span>
            </NavLink>
          </nav>
          <div className="mt-6">
            <a href="https://www.codenode.com.br/" target="_blank" className="text-xs underline text-muted-foreground hover:text-foreground transition-colors">CodeNode.AI</a>
          </div>
        </div>
      </aside>
      <main className="main">
        <header className="header">
          <div className="container-page flex items-center justify-between">
            <div className="font-semibold text-foreground">TraitView • MVP (Local)</div>
            <div className="flex gap-2">
              <Button 
  onClick={() => { localStorage.clear(); location.reload(); }} 
  variant="outline" 
  className="border-border text-foreground hover:bg-muted"
>
  Resetar Dados
</Button>
            </div>
          </div>
        </header>
        <div className="container-page py-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card">
              <Outlet />
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
