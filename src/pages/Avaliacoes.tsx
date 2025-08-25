import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '@/lib/dataService';
import { uid } from '@/lib/utils';

export default function Avaliacoes() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [selectedCols, setSelectedCols] = useState<string[]>([]);

  // Buscar dados do Supabase
  const { data: collaborators = [], isLoading: loadingCollaborators } = useQuery({
    queryKey: ['colaboradores'],
    queryFn: () => dataService.colaboradores.getAll()
  });

  const { data: tests = [], isLoading: loadingTests } = useQuery({
    queryKey: ['testes'],
    queryFn: () => dataService.testes.getAll()
  });

  const { data: evaluations = [], isLoading: loadingEvaluations } = useQuery({
    queryKey: ['avaliacoes'],
    queryFn: () => dataService.avaliacoes.getAll()
  });

  // Mutation para criar avaliação
  const createEvaluationMutation = useMutation({
    mutationFn: async () => {
      if (!name || selectedTests.length === 0 || selectedCols.length === 0) {
        throw new Error("Informe nome, ao menos 1 teste e 1 colaborador.");
      }

      // Criar a avaliação
      const avaliacao = await dataService.avaliacoes.create({
        nome: name,
        descricao: null,
        criado_por: "usuário-logado-id", // TODO: Obter ID do usuário logado
        testes_ids: selectedTests,
        status: "rascunho"
      });

      // Criar respostas para cada colaborador
      const respostasPromises = selectedCols.map(colaboradorId => {
        return selectedTests.map(testeId => {
          return dataService.respostas.create({
            avaliacao_id: avaliacao.id,
            colaborador_id: colaboradorId,
            teste_id: testeId,
            teste_versao: 1, // TODO: Obter versão correta do teste
            respostas: null,
            resultado: null
          });
        });
      });

      // Esperar todas as promessas
      await Promise.all(respostasPromises.flat());

      return avaliacao;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] });
      setName("");
      setSelectedTests([]);
      setSelectedCols([]);
      alert("Avaliação criada com sucesso!");
    },
    onError: (error: any) => {
      console.error("Erro ao criar avaliação:", error);
      alert(error.message || "Erro ao criar avaliação. Verifique o console para mais detalhes.");
    }
  });

  function toggle(list: string[], id: string, setter: (v: string[]) => void) {
    setter(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  }

  // Mostrar loading enquanto carrega os dados
  if (loadingCollaborators || loadingTests || loadingEvaluations) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="p-10 text-center"
      >
        Carregando avaliações...
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-2">Nova avaliação</h3>
            <div className="grid gap-2">
              <input 
                className="input-like" 
                placeholder="Nome da avaliação" 
                value={name} 
                onChange={(e)=>setName(e.target.value)} 
              />
              <div>
                <div className="text-sm font-medium mb-1">Testes</div>
                <div className="grid gap-1 max-h-40 overflow-auto border rounded-xl p-2">
                  {tests.map(t => (
                    <label key={t.id} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={selectedTests.includes(t.id)} 
                        onChange={()=>toggle(selectedTests, t.id, setSelectedTests)} 
                      />
                      <span>{t.nome}</span>
                    </label>
                  ))}
                  {tests.length === 0 && <div className="text-xs text-muted-foreground">Nenhum teste.</div>}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Colaboradores</div>
                <div className="grid gap-1 max-h-40 overflow-auto border rounded-xl p-2">
                  {collaborators.map(c => (
                    <label key={c.id} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={selectedCols.includes(c.id)} 
                        onChange={()=>toggle(selectedCols, c.id, setSelectedCols)} 
                      />
                      <span>{c.nome} <span className="text-xs text-muted-foreground">&lt;{c.email}&gt;</span></span>
                    </label>
                  ))}
                  {collaborators.length === 0 && <div className="text-xs text-muted-foreground">Nenhum colaborador.</div>}
                </div>
              </div>
              <Button 
                onClick={() => createEvaluationMutation.mutate()}
                disabled={createEvaluationMutation.isPending}
              >
                {createEvaluationMutation.isPending ? 'Criando...' : 'Criar avaliação'}
              </Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Avaliações</h2>
            <div className="overflow-auto rounded-xl border">
              <Table>
                <THead>
                  <TR>
                    <TH>Nome</TH>
                    <TH>Testes</TH>
                    <TH>Status</TH>
                    <TH>Links</TH>
                  </TR>
                </THead>
                <TBody>
                  {evaluations.map(ev => (
                    <TR key={ev.id}>
                      <TD>{ev.nome}</TD>
                      <TD>{ev.testes_ids?.length || 0}</TD>
                      <TD>
                        <span className={`badge ${ev.status === 'rascunho' ? 'bg-yellow-500' : ev.status === 'enviada' ? 'bg-blue-500' : 'bg-green-500'}`}>
                          {ev.status}
                        </span>
                      </TD>
                      <TD className="space-y-1">
                        {/* TODO: Implementar geração de links */}
                        <div className="text-xs text-muted-foreground">
                          Links serão gerados após criação
                        </div>
                      </TD>
                    </TR>
                  ))}
                  {evaluations.length === 0 && <TR><TD colSpan={4} className="text-center py-6 text-muted-foreground">Nenhuma avaliação ainda.</TD></TR>}
                </TBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
