import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { useQuery } from '@tanstack/react-query';
import { dataService } from '@/lib/dataService';

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((a,b)=>a+b,0)/values.length;
}

export default function Relatorios() {
  const ref = useRef<HTMLDivElement>(null);

  // Buscar dados do Supabase
  const { data: respostas = [], isLoading: loadingRespostas } = useQuery({
    queryKey: ['respostas'],
    queryFn: () => dataService.respostas.getAll()
  });

  const { data: testes = [], isLoading: loadingTestes } = useQuery({
    queryKey: ['testes'],
    queryFn: () => dataService.testes.getAll()
  });

  const { data: avaliacoes = [], isLoading: loadingAvaliacoes } = useQuery({
    queryKey: ['avaliacoes'],
    queryFn: () => dataService.avaliacoes.getAll()
  });

  const { data: colaboradores = [], isLoading: loadingColaboradores } = useQuery({
    queryKey: ['colaboradores'],
    queryFn: () => dataService.colaboradores.getAll()
  });

  // Mostrar loading enquanto carrega os dados
  if (loadingRespostas || loadingTestes || loadingAvaliacoes || loadingColaboradores) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.25 }}
        className="p-10 text-center"
      >
        Carregando relatórios...
      </motion.div>
    );
  }

  // Processar os dados para exibição
  const rows = respostas.map(resposta => {
    const teste = testes.find(t => t.id === resposta.teste_id);
    const avaliacao = avaliacoes.find(a => a.id === resposta.avaliacao_id);
    const colaborador = colaboradores.find(c => c.id === resposta.colaborador_id);
    
    // Calcular o score médio
    let score = 0;
    if (resposta.respostas && Array.isArray(resposta.respostas)) {
      score = average(resposta.respostas.map(r => r.resposta));
    }
    
    return {
      avaliacaoNome: avaliacao?.nome || "—",
      testeNome: teste?.nome || "—",
      colaboradorNome: colaborador?.nome || resposta.colaborador_id.slice(0,8) + "…",
      score: score.toFixed(2)
    }
  });

  async function exportPDF() {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Dimensionar a imagem mantendo aspecto
    const imgWidth = pageWidth - 60;
    const imgHeight = canvas.height * (imgWidth / canvas.width);
    const y = (pageHeight - imgHeight) / 2;
    pdf.addImage(imgData, "PNG", 30, Math.max(30, y), imgWidth, imgHeight);
    pdf.save("relatorio-traitview.pdf");
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Relatórios</h2>
        <Button onClick={exportPDF} disabled={rows.length === 0}>Exportar PDF</Button>
      </div>

      <div ref={ref} className="overflow-auto rounded-xl border bg-white p-2">
        <Table>
          <THead>
            <TR>
              <TH>Avaliação</TH>
              <TH>Teste</TH>
              <TH>Colaborador</TH>
              <TH>Score médio (1–5)</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((r, i) => (
              <TR key={i}>
                <TD>{r.avaliacaoNome}</TD>
                <TD>{r.testeNome}</TD>
                <TD>{r.colaboradorNome}</TD>
                <TD>{r.score}</TD>
              </TR>
            ))}
            {rows.length === 0 && <TR><TD colSpan={4} className="text-center py-6 text-muted-foreground">Sem respostas ainda.</TD></TR>}
          </TBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">* Para PDF com mais fidelidade tipográfica, mover para renderização server-side no futuro.</p>
    </motion.div>
  );
}
