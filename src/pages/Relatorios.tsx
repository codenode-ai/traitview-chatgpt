import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { useQuery } from '@tanstack/react-query';
import { dataService } from '@/lib/dataService';

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

  // Mostrar loading enquanto carrega os dados
  if (loadingRespostas || loadingTestes) {
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
  const rows = respostas
    .filter(resposta => resposta.status === 'concluida') // Apenas respostas concluídas
    .map(resposta => {
      const teste = testes.find(t => t.id === resposta.teste_id);
      
      // Obter score e faixa do resultado calculado
      let score = "0.00";
      let faixa = "Não definida";
      
      if (resposta.resultado) {
        score = resposta.resultado.score.toFixed(2);
        faixa = resposta.resultado.faixa || "Não definida";
      }
      
      return {
        id: resposta.id,
        testeNome: teste?.nome || "—",
        email: resposta.colaborador_id || "destinatario@exemplo.com", // Usar o ID do colaborador ou e-mail padrão
        score: score,
        faixa: faixa,
        data: new Date(resposta.concluido_em || resposta.created_at).toLocaleDateString()
      }
    })
    .sort((a, b) => parseFloat(b.score) - parseFloat(a.score)); // Ordenar por score descendente

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
              <TH>Teste</TH>
              <TH>E-mail</TH>
              <TH>Score médio (1–5)</TH>
              <TH>Faixa</TH>
              <TH>Data</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((r) => (
              <TR key={r.id}>
                <TD>{r.testeNome}</TD>
                <TD>{r.email}</TD>
                <TD>
                  <div className="flex items-center gap-2">
                    <span>{r.score}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-vibrant-blue h-2 rounded-full" 
                        style={{ width: `${(parseFloat(r.score) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </TD>
                <TD>
                  <span className={`badge ${
                    r.faixa === "Baixo" ? "bg-red-500" : 
                    r.faixa === "Médio" ? "bg-yellow-500" : 
                    r.faixa === "Alto" ? "bg-green-500" : "bg-gray-500"
                  }`}>
                    {r.faixa}
                  </span>
                </TD>
                <TD>{r.data}</TD>
              </TR>
            ))}
            {rows.length === 0 && <TR><TD colSpan={5} className="text-center py-6 text-muted-foreground">Sem respostas concluídas ainda.</TD></TR>}
          </TBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">* Para PDF com mais fidelidade tipográfica, mover para renderização server-side no futuro.</p>
    </motion.div>
  );
}
