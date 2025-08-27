import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { dataService } from '@/lib/dataService';
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";
import { Teste } from "@/lib/supabaseClient";

export default function Testes() {
  const navigate = useNavigate();
  
  // Buscar testes do Supabase
  const { data: tests = [], isLoading } = useQuery({
    queryKey: ['testes'],
    queryFn: async () => {
      console.log('Testes: Buscando testes...');
      try {
        const result = await dataService.testes.getAll();
        console.log('Testes: Testes encontrados:', result);
        return result;
      } catch (error) {
        console.error('Testes: Erro ao buscar testes:', error);
        throw error;
      }
    }
  });

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="p-10 text-center"
      >
        Carregando testes...
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Testes</h2>
          <Button onClick={() => navigate("/testes/criar")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Teste
          </Button>
        </div>
        
        <div className="overflow-auto rounded-xl border">
          <Table>
            <THead>
              <TR>
                <TH>Nome</TH>
                <TH>Categoria</TH>
                <TH>Perguntas</TH>
                <TH className="text-right">Ações</TH>
              </TR>
            </THead>
            <TBody>
              {tests.map(t => (
                <TR key={t.id}>
                  <TD>{t.nome}</TD>
                  <TD>{t.categoria || "Customizado"}</TD>
                  <TD>{t.perguntas?.length || 0}</TD>
                  <TD className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/testes/editar/${t.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TD>
                </TR>
              ))}
              {tests.length === 0 && (
                <TR>
                  <TD colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum teste cadastrado ainda.
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
}
