import { useDB } from "@/stores/db";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Avaliacoes() {
  const collaborators = useDB(s => s.collaborators);
  const tests = useDB(s => s.tests);
  const evaluations = useDB(s => s.evaluations);
  const createEvaluation = useDB(s => s.createEvaluation);

  const [name, setName] = useState("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [selectedCols, setSelectedCols] = useState<string[]>([]);

  function toggle(list: string[], id: string, setter: (v: string[]) => void) {
    setter(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  }

  function create() {
    if (!name || selectedTests.length === 0 || selectedCols.length === 0) {
      alert("Informe nome, ao menos 1 teste e 1 colaborador.");
      return;
    }
    const id = createEvaluation(name, selectedTests, selectedCols);
    const ev = evaluations.find(e => e.id === id);
    if (ev) alert("Avaliação criada! Links gerados na tabela abaixo.");
    setName("");
    setSelectedTests([]);
    setSelectedCols([]);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="grid gap-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-2">Nova avaliação</h3>
            <div className="grid gap-2">
              <input className="input-like" placeholder="Nome da avaliação" value={name} onChange={(e)=>setName(e.target.value)} />
              <div>
                <div className="text-sm font-medium mb-1">Testes</div>
                <div className="grid gap-1 max-h-40 overflow-auto border rounded-xl p-2">
                  {tests.map(t => (
                    <label key={t.id} className="flex items-center gap-2">
                      <input type="checkbox" checked={selectedTests.includes(t.id)} onChange={()=>toggle(selectedTests, t.id, setSelectedTests)} />
                      <span>{t.name}</span>
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
                      <input type="checkbox" checked={selectedCols.includes(c.id)} onChange={()=>toggle(selectedCols, c.id, setSelectedCols)} />
                      <span>{c.name} <span className="text-xs text-muted-foreground">&lt;{c.email}&gt;</span></span>
                    </label>
                  ))}
                  {collaborators.length === 0 && <div className="text-xs text-muted-foreground">Nenhum colaborador.</div>}
                </div>
              </div>
              <Button onClick={create}>Criar avaliação</Button>
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
                    <TH>Gerados</TH>
                    <TH>Links</TH>
                  </TR>
                </THead>
                <TBody>
                  {evaluations.map(ev => (
                    <TR key={ev.id}>
                      <TD>{ev.name}</TD>
                      <TD>{ev.testIds.length}</TD>
                      <TD>{ev.links.length}</TD>
                      <TD className="space-y-1">
                        {ev.links.map(l => (
                          <div key={l.token} className="flex items-center gap-2">
                            <span className="badge">{l.status}</span>
                            <Button variant="outline" onClick={()=>window.open(`/avaliacao/${l.token}`, "_blank")}>Abrir</Button>
                            <code className="text-xs">{location.origin}/avaliacao/{l.token}</code>
                          </div>
                        ))}
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
