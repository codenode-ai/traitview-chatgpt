import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/lib/dataService';
import { supabase } from '@/lib/supabaseClient';
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Teste } from "@/lib/supabaseClient";

export default function Testes() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
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

  // Mutation para deletar teste
  const deleteTestMutation = useMutation({
    mutationFn: async (id: string) => {
      return await dataService.testes.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testes'] });
      alert('Teste excluído com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao deletar teste:', error);
      if (error.message && error.message.includes('foreign key constraint')) {
        alert('Não é possível excluir este teste porque ele possui respostas associadas. Exclua as respostas primeiro.');
      } else {
        alert(`Erro ao deletar teste: ${error.message || 'Verifique o console para mais detalhes.'}`);
      }
    }
  });

  // Função para confirmar e deletar teste
  const handleDeleteTest = async (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir o teste \"${nome}\"? Esta ação não pode ser desfeita.`)) {
      try {
        // Buscar todas as respostas para verificar se há associações
        const { data: todasRespostas, error: respostasError } = await supabase
          .from('respostas')
          .select('*')
          .eq('teste_id', id);
        
        if (respostasError) {
          console.error('Erro ao verificar respostas:', respostasError);
          alert('Erro ao verificar respostas associadas. Verifique o console para mais detalhes.');
          return;
        }
        
        // Buscar avaliações associadas ao teste
        const { data: avaliacoes, error: avaliacoesError } = await supabase
          .from('avaliacoes')
          .select('*');
        
        if (avaliacoesError) {
          console.error('Erro ao buscar avaliações:', avaliacoesError);
          alert('Erro ao buscar avaliações associadas. Verifique o console para mais detalhes.');
          return;
        }
        
        // Filtrar avaliações que contêm este teste
        const avaliacoesComEsteTeste = avaliacoes?.filter(avaliacao => 
          avaliacao.testes_ids && avaliacao.testes_ids.includes(id)
        ) || [];
        
        // Se houver respostas ou avaliações associadas, perguntar se deseja excluí-las também
        const totalAssociacoes = (todasRespostas?.length || 0) + avaliacoesComEsteTeste.length;
        
        if (totalAssociacoes > 0) {
          let mensagem = `Este teste possui ${totalAssociacoes} associação(ões):\n`;
          if (todasRespostas && todasRespostas.length > 0) {
            mensagem += `- ${todasRespostas.length} resposta(s)\n`;
          }
          if (avaliacoesComEsteTeste.length > 0) {
            mensagem += `- ${avaliacoesComEsteTeste.length} avaliação(ões)\n`;
          }
          mensagem += `\nDeseja também excluir todas essas associações?`;
          
          if (!confirm(mensagem)) {
            return;
          }
          
          // Excluir todas as respostas associadas primeiro
          if (todasRespostas && todasRespostas.length > 0) {
            const { error: deleteRespostasError } = await supabase
              .from('respostas')
              .delete()
              .eq('teste_id', id);
            
            if (deleteRespostasError) {
              console.error('Erro ao excluir respostas:', deleteRespostasError);
              alert('Erro ao excluir respostas associadas. Verifique o console para mais detalhes.');
              return;
            }
          }
          
          // Remover este teste das avaliações que o contêm
          for (const avaliacao of avaliacoesComEsteTeste) {
            const novosTestesIds = avaliacao.testes_ids.filter((testeId: string) => testeId !== id);
            
            const { error: updateAvaliacaoError } = await supabase
              .from('avaliacoes')
              .update({ testes_ids: novosTestesIds })
              .eq('id', avaliacao.id);
            
            if (updateAvaliacaoError) {
              console.error('Erro ao atualizar avaliação:', updateAvaliacaoError);
              alert(`Erro ao atualizar avaliação ${avaliacao.nome}. Verifique o console para mais detalhes.`);
              return;
            }
          }
        }
        
        // Agora podemos excluir o teste
        deleteTestMutation.mutate(id);
      } catch (error) {
        console.error('Erro ao excluir teste:', error);
        alert('Erro ao excluir teste. Verifique o console para mais detalhes.');
      }
    }
  };

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
              {tests.map((t: Teste) => (
                <TR key={t.id}>
                  <TD>{t.nome}</TD>
                  <TD>{t.categoria || "Customizado"}</TD>
                  <TD>{t.perguntas?.length || 0}</TD>
                  <TD className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(`/testes/editar/${t.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteTest(t.id, t.nome)}
                        disabled={deleteTestMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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